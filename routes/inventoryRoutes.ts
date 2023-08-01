import { Router } from "express";
import {
  addToInventoray,
  getAllDonarsOfOrganization,
  getAllHospitalsOfOrganization,
  getInventoryTableData,
  getInventoryTableDataWithFilters,
  getAllOrganizationsOfHospitalOrDonar,
} from "../controllers/inventoryControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();

router.post("/add", authMiddleware, addToInventoray);

router.get("/", authMiddleware, getInventoryTableData);

router.get("/all-donars", authMiddleware, getAllDonarsOfOrganization);

router.get("/all-hospitals", authMiddleware, getAllHospitalsOfOrganization);

router.get(
  "/all-organizations",
  authMiddleware,
  getAllOrganizationsOfHospitalOrDonar
);

router.post("/filters", authMiddleware, getInventoryTableDataWithFilters);

export default router;
