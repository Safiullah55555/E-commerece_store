import express from 'express';
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';


const route= express.Router();

route.get("/", protectedRoute, getCartProducts)
route.post("/", protectedRoute, addToCart)
route.delete("/", protectedRoute, removeAllFromCart)
route.put("/:id", protectedRoute, updateQuantity) // + -


export default route