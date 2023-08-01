import { Router } from "express";
import InventorayModel from "../models/inventoryModal";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getBloodGroupsData } from "../controllers/dashboardControllers";

const router = Router();

router.get("/blood-groups-data", authMiddleware, getBloodGroupsData);

export default router;
