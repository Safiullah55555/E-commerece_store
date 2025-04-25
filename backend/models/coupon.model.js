
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
        code:{
                type:String,
                required:[true,'Please provide a code'],
                unique: true,
        },
        discountPercentage:{
                type:Number,
                required:[true,'Please provide a discount percentage'],
                min:0,
                max:100
        },
        expirationDate:{
                type:Date,
                required:[true,'Please provide an expiration date']
        },
        isActive:{
                type:Boolean,
                default:true
        },
        userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true,
                unique:true,
        },
},{timestamps:true}
);

export const Coupon= mongoose.model("Coupon",couponSchema);

export default Coupon;