import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


//middleware to protect routes.
export const protectedRoute=async (req, res, next) => {
        try {
                const accessToken = req.cookies.accessToken;

                if(!accessToken){
                        return res.status(401).json({message:"unauthorized- no token provided"});
                }

                try {
                const decoded= jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                const user = await User.findById(decoded.userId).select("-password");

                if(!user){
                        return res.status(404).json({message:"user not found"});
                }
                req.user = user;

                next();

                } catch (error) {
                        if(error.name === "TokenExpiredError"){
                                return res.status(401).json({message:"unauthorized- token expired"});
                        }
                        throw error;
                }


        } catch (error) {
                console.log("error in protected route middleware:", error.message);
                res.status(401).json({message:"unauthorized- invalid token"});
        }
}

//middleware to admin routes.
export const adminRoute = (req, res, next) => {
        if(req.user && req.user.role === 'admin'){
                next();
        }else{
                return res.status(401).json({message:"unauthorized- not an admin"});
        }
}