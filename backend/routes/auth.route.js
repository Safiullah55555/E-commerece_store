import express from 'express';
import { login, logout, signup , refreshToken, getProfile } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//....................................................
//NOTE: these codes are going to controllers folder. so it will change the structure of the code ( MVC ) 
//      (req, res) => {
//        res.send("login route is working");
//       })
// .................................................

//sign Up.
router.post("/signup", signup)

//login.
router.post("/login",login)

//logout.
router.post("/logout", logout)

//refresh token.
router.post("/refresh-token", refreshToken)

//get Profile.
router.get("/profile",protectedRoute, getProfile)


export default router 


