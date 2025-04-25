import { motion } from "framer-motion"
import { useCartStore } from "../stores/useCartStore"
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

const stripePromise = loadStripe("pk_test_51R0Si04EjXV9y6sMwI9pzO9ZfaAbwkeNTC3uvyHnBbwV4No9i2NKhO3qL6SK2AqGVXTDD2AFSPK6jLrrTWe0Njmj00vYgaxwH6")

const OrderSummary = () => {

        const { total, subtotal , isCouponApplied , coupon, cart } = useCartStore()
        const savings = subtotal - total;

        const formattedSubtotal = subtotal.toFixed(2)
        const formattedTotal = total.toFixed(2)
        const formattedSavings = savings.toFixed(2)

	
	const handlePayment = async () => {
		const stripe = await stripePromise;
		const res = await axios.post("/payments/create-checkout-session", { 
			products: cart, 
			couponCode: coupon ? coupon.code : null
		})
		const session = res.data; 

		// Check if session.id exists
		 if (!session.id) {
			console.error("Error: Missing session ID from backend response.");
			return;
		    }

		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		})
		if (result.error) {
                        console.error("Error:", result.error.message);
                }
	}
	

        return (
                <motion.div className='space-y-4 rounded-lg border border-gray-700 bg-white p-4 shadow-sm sm:p-6'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                >
                        <p className='text-xl font-semibold text-black'>Order summary</p>

                        <div className="space-y-4">
                                <div className="space-y-2">
                                        <dl className='flex items-center justify-between gap-4'>
                                                <dt className='text-base font-normal text-black'>Original price</dt>
                                                <dd className='text-base font-medium text-black'>${formattedSubtotal}</dd>
                                        </dl>
                                        {savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-black'>Savings</dt>
							<dd className='text-base font-medium text-black'>-${formattedSavings}</dd>
						</dl>
					)}
                                        {coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-black'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-black'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
                                        <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-black'>Total</dt>
						<dd className='text-base font-bold text-black text-underline'>${formattedTotal}</dd>
					</dl>
                                </div>

                                <motion.button
					className='flex w-full items-center justify-center rounded-lg bg-[#fed813] px-5 py-2.5 text-sm font-medium text-black hover:bg-[#febd69] focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
                                        
					Proceed to Checkout
				</motion.button>
                                <div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-blue-400 underline hover:text-blue-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>

                        </div>

                </motion.div>
        )
}

export default OrderSummary
//