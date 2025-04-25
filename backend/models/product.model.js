import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
        name:{
                type:String,
                required:[true,'Please provide a name']
        },
        description:{
                type:String,
                required:[true,'Please provide a description']
        },
        price:{
                type:Number,
                min:0,
                required:[true,'Please provide a price']
        },
        image:{
                type:String,
                required:[true,'Please provide an image']
        },
        additionalImages: {
                type: [String], // array of image URLs
                default: []
              },
              
        category:{
                type:String,
                required:[true,'Please provide a category']
        },
        isFeatured:{
                type:Boolean,
                default:false
        }
        
},
{timestamp:true});

const Product = mongoose.model('Product',productSchema);

export default Product;