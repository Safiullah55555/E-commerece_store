import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';
import Product from '../models/product.model.js'


//get all products from the database.
export const getAllProducts = async(req,res) =>{
        try {
                const products = await Product.find();
                // console.log("Products in DB:", await Product.find({}));
                res.json({products});
        } catch (error) {
                console.log("error in getallproducts controller:", error.message)
                res.status(500).json({message:"Server error", error: error.message});
        }
}

//get featured products.
export const getFeaturedProducts= async (req, res, next) => {
        try {
                let featuredProducts = await redis.get("featured_products")
                if(featuredProducts){
                        return res.json(JSON.parse(featuredProducts));
                }

                //if not in redis fetch in mongodb.
                //.lean() return a plain object instead of mongodb document. and its good for performance.
                featuredProducts = await Product.find({isFeatured:true}).lean();

                if(!featuredProducts){
                        return res.status(404).json({message:"No featured products found"});
                }

                //store in redis for featured product access.
                await redis.set("featured_products", JSON.stringify(featuredProducts));
                res.json(featuredProducts);
        } catch (error) {
                console.log("error in getfeaturedProducts controller:", error.message);
                res.status(500).json({message:"Server error", error: error.message});
        }
}

//create products controller.
export const createProduct=async (req,res)=>{
        try {
        const {name,description,price,image,category,additionalImages} = req.body

        let cloudinaryResponse= null

        if(image){
                cloudinaryResponse = await cloudinary.uploader.upload(image,{folder:"products"});
        }

        // For additionalImages, you may need to upload each image to cloudinary similarly
    // Here assuming additionalImages are already URLs or base64 strings to be uploaded similarly

    // Example: Upload additional images to cloudinary and get URLs
    const uploadedAdditionalImages = [];
    if (additionalImages && additionalImages.length > 0) {
      for (const img of additionalImages) {
        const res = await cloudinary.uploader.upload(img, { folder: "products" });
        uploadedAdditionalImages.push(res.secure_url);
      }
    }


        const product = await Product.create({
                name,
                description,
                price,
                image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url :"",
                additionalImages: uploadedAdditionalImages, // Store the URLs of additional images
                category,
        })

        res.status(201).json(product);
                
        } catch (error) {
                console.log("error in creating product:", error.message);
                res.status(500).json({message:"Server error", error: error.message})
        }
        
}

//delete product controller.
export const deleteProduct= async (req, res) => {
        try {
                const product = await Product.findById(req.params.id)
                if(!product){
                        return res.status(404).json({message:"Product not found"});
                }

                //delete image from cloudinary.
                if(product.image){
                        const publicId = product.image.split("/").pop().split(".")[0]; // get id of image to delete it.
                        try {
                                await cloudinary.uploader.destroy(`products/${publicId}`)
                                console.log("Image deleted from cloudinary")
                        } catch (error) {
                                console.log("error in deleting image from cloudinary:", error.message)
                                res.status(500).json({message:"Error deleting image from cloudinary", error: error.message})
                        }
                }
                //delete image from mongodb server.
                await Product.findByIdAndDelete(req.params.id);
                res.json({message:"Product deleted successfully"});

        } catch (error) {
                console.log("error in deleteproduct controller:", error.message);
                res.status(500).json({message:"Server error", error: error.message});
        }
}

//get recommended products.
export const getRecommendedProducts= async (req, res)=>{

        try {
                const products = await Product.aggregate([
                        {
                                $sample:{size:4}
                        },
                        {
                                $project:{
                                        _id:1,
                                        name:1,
                                        description:1,
                                        image:1,
                                        price:1,
                                }
                        }
                ])
                res.json(products);

        } catch (error) {
                console.log("error in getrecommendedproducts controller:", error.message);
                res.status(500).json({message:"Server error", error: error.message});
        }
}

//get products by category.
export const getProductsByCategory= async (req,res)=>{

        const {category}= req.params;

        try {
                const products = await Product.find({category});
                res.json({products});
        } catch (error) {
                console.log("error in getproductsbycategory controller:", error.message);
                res.status(500).json({message:"Server error", error: error.message});
        }
}

//toggle featured product.
export const toggleFeaturedProduct = async (req, res) => {
        try {
                const product = await Product.findById(req.params.id);
                if(product){
                        product.isFeatured = !product.isFeatured;
                        const updateProduct = await product.save()
                        await updateFeaturedProductsCache()

                        res.json(updateProduct);
                }else{
                        res.status(404).json({message:"Product not found"});
                }
        } catch (error) {
                console.log("error in featured product:", error.message)
                res.status(500).json({message:"Server error", error: error.message});
        }

        async function updateFeaturedProductsCache(){
                try {
                        const featuredProducts = await Product.find({isFeatured:true}).lean(); // lean() return JS object instead if full MDB document.
                        await redis.set("featured_products", JSON.stringify(featuredProducts));
                } catch (error) {
                        console.log("error in updating featured products CACHE:", error.message);
                        res.status(500).json({message:"server error :", error: error.message});
                }
        }      
}

// Get a single product by ID
export const getProductById = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          res.json(product);
        } catch (error) {
          console.log("error in getProductById controller:", error.message);
          res.status(500).json({ message: "Server error", error: error.message });
        }
      };
      