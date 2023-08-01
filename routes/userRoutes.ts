import { Router } from "express";
import {
  loginUser,
  registerUser,
  getUser,
} from "../controllers/userControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getUser);

router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;
