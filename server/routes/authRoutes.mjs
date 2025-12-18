import express from "express";
import { register, login, userinfo, usersList } from "../controllers/authController.mjs";
import { authmiddleware } from "../middlewares/auth.mjs"
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/user-info", authmiddleware, userinfo)
router.post("/users-list", authmiddleware, usersList)

export default router;