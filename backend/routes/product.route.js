import express from 'express';
import { createProduct, deleteProduct, getAllProducts,getFeaturedProducts, getProductById, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controllers/product.controller.js';
import { adminRoute, protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get("/",getAllProducts)
router.get("/featured",getFeaturedProducts)
router.get("/category/:category",getProductsByCategory)
router.get("/recommendations",getRecommendedProducts)
router.post("/",protectedRoute,adminRoute, createProduct)
router.patch("/:id",protectedRoute,adminRoute, toggleFeaturedProduct ) //patch or put to update. its feature route.
router.delete("/:id",protectedRoute,adminRoute, deleteProduct)
router.get("/:id", getProductById); // product details route.


export default router


