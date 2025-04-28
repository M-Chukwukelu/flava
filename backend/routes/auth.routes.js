import express from "express"; 

import { getMe, login, logout, signup, oauthCallback} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post('/oauth/callback', oauthCallback);


export default router;