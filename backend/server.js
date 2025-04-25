import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import productRoute from './routes/product.route.js';
import cartRoute from './routes/cart.route.js';
import couponRoute from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: "10mb"})) //to parse the body of the request message.
app.use(cookieParser())


app.use("/api/auth", authRoutes);// authentication routes

app.use("/api/products", productRoute);//products routes.

app.use("/api/cart", cartRoute);//cart routes.

app.use("/api/coupons", couponRoute);//coupon routes.

app.use("/api/payments", paymentRoutes);//payment routes.

app.use("/api/analytics", analyticsRoutes);//analytics routes. 




app.listen(PORT,()=>{
        console.log("server listening on port " + PORT);

        connectDB();
})

