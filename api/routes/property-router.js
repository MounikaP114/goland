import express from "express";
import {
  createProperty,
  deleteProperty,
  updateProperty,
  getProperty,
  getPropertys,
} from "../controllers/property-controller.js";
import { verifyToken } from "../utils/verifyuser.js";
const router = express.Router();

router.post("/create", verifyToken, createProperty);
router.delete("/delete/:id", verifyToken, deleteProperty);
router.post("/update/:id", verifyToken, updateProperty);
router.get("/get/:id", getProperty);
router.get("/get", getPropertys);

export default router;
