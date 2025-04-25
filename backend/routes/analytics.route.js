import e from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";
import { analytics } from "../controllers/analytics.controller.js";

const router = e.Router();

router.get("/",protectedRoute ,adminRoute, analytics)

export default router;  


