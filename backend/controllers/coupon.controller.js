import Coupon from "../models/coupon.model.js";


//get coupon.
export const getCoupon = async (req, res) => {
        try {
                const coupon = await Coupon.findOne({userId: req.user._id, isActive:true});
                res.json(coupon || null);
        } catch (error) {
                console.log("error in get coupon controller:", error.message);
                res.status(500).json({message:"Server error", error: error.message});
        }
}

//validate coupon.
export const validateCoupon = async (req, res) => {
        // console.log("validateCoupon called"); // Debug log
        // console.log("Request body:", req.body); // Debug log
        // console.log("Request user:", req.user); // Debug log
        try {
                const {code} = req.body;
                const coupon = await Coupon.findOne({code:code, userId: req.user._id, isActive: true});
                console.log("Fetched coupon here :", coupon); // Debug log

                if(!coupon) {
                        return res.status(400).json({message:"Invalid coupon"});
                }

                if(coupon.expirationDate < new Date()){
                        coupon.isActive = false;
                        await coupon.save();
                        return res.status(400).json({message:"Coupon expired"});
                }
                res.json({
                        message:"Coupon is valid",
                        code: coupon.code,
                        discountPercentage: coupon.discountPercentage
                });
        } catch (error) {
                console.log("error in validatecoupon controller:", error.message);
                res.status(500).json({message:"Server error", error: error.message});
        }
}