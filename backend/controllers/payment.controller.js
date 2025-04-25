import dotenv from "dotenv";
import Coupon from "../models/coupon.model.js"
import Order from "../models/order.model.js"
import { stripe } from "../lib/stripe.js";



dotenv.config();

//create checkout session.
export const createCheckoutSession = async (req, res) => {
        try {
                const { products, couponCode } = req.body;

                if (!Array.isArray(products) || products.length === 0) {
                        return res.status(400).json({ message: "Please add products to cart" });
                }

                let totalAmount = 0;
                const lineItems = products.map((product) => {
                        const amount = Math.round(product.price * 100); // *100 ??, because stripe works in cents.
                        totalAmount += amount * product.quantity;

                        return {
                                price_data: {
                                        currency: 'usd', // or any other supported currency.
                                        product_data: {
                                                name: product.title || "unnamed product",
                                                images: product.image ? [product.image] : [],
                                        },
                                        unit_amount: amount,
                                },
                                quantity: product.quantity || 1,
                        }
                })
                
                let coupon = null;
                if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

                const session = await stripe.checkout.sessions.create({
                        payment_method_types: ["card",],
                        line_items: lineItems,
                        mode: "payment",
                        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
                        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
                        discounts: coupon ?
                                [
                                        {
                                                coupon: await createStripeCoupon(coupon.discountPercentage),
                                        },
                                ]
                                : [],
                        metadata: {
                                userId: req.user._id.toString(),
                                couponCode: couponCode || "",
                                products: JSON.stringify(products.map((p) => ({ id: p._id, quantity: p.quantity, price: p.price })))
                        }
                });
                //20000 = 200 dollars.
                if (totalAmount >= 20000) {
                        await createNewCoupon(req.user._id);
                }
                res.json({ id: session.id, totalAmount: totalAmount / 100 });
        } catch (error) {
                console.error("error in creatiCheckout Session : ", error);
                res.status(500).json({ message: "Server error", error: error.message });
        }
};


//In Stripe.
async function createStripeCoupon(discountPercentage) {
        const coupon = await stripe.coupons.create({
                percent_off: discountPercentage,
                duration: "once",
        })

        return coupon.id
};

//
// In Data Base
async function createNewCoupon(userId) {
        await Coupon.findOneAndDelete({userId})///---------->
        const newCoupon = new Coupon({
                code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
                discountPercentage: 10,
                expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now.
                userId: userId

        })
        await newCoupon.save()

        return newCoupon
};



/// create checkout success.
export const createCheckoutSuccess = async (req, res) => {
        try {
                const { sessionId } = req.body;
                const session = await stripe.checkout.sessions.retrieve(sessionId);

                if (session.payment_status === "paid") {

                        //---------------> added extra problem solve : duplicate key , just check another product and it worked now don't know it was because of choosing another product or adding this line. if it was(success) due to another product its fine , we will also delete all products and add new which will change IDs 
                        // Check if an order with the same stripeSessionId already exists
                        const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
                        if (existingOrder) {
                                return res.status(200).json({
                                        success: true,
                                        message: "Order already processed",
                                        orderId: existingOrder._id,
                                });
                        }
                        //--------------->
                        if (session.metadata.couponCode) {
                                await Coupon.findOneAndUpdate({
                                        code: session.metadata.couponCode,
                                        userId: session.metadata.userId,
                                }, {
                                        isActive: false,
                                })
                        }

                        //create new order .
                        const products = JSON.parse(session.metadata.products)
                        const newOrder = new Order(
                                {
                                        user: session.metadata.userId,
                                        products: products.map(product => ({
                                                product: product.id,
                                                quantity: product.quantity,
                                                price: product.price,
                                        })),
                                        totalAmount: session.amount_total / 100, //converter to dollars from cents by  / 100.
                                        stripeSessionId: sessionId,
                                }
                        )
                        await newOrder.save()
                        res.status(200).json({ success: true, message: "Payment successful,order created, coupon deactivated.", orderId: newOrder._id })
                }

        } catch (error) {
                console.log("error in createCheckout Success", error.message)
                res.status(500).json({ message: "server error", error: error.message })
        }
}



