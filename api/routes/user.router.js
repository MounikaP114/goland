import express from "express";
import {
  updateUserInfo,
  user,
  deleteUserInfo,
  getUserListProperties,
  getUser,
  getUsers
} from "../controllers/user-controller.js";
import { verifyToken } from "../utils/verifyuser.js";
const router = express.Router();
router.get("/test", user);
router.post("/update/:id", verifyToken, updateUserInfo);
router.delete("/delete/:id", verifyToken, deleteUserInfo);
router.get("/properties-list/:id", verifyToken, getUserListProperties);
router.get("/:id", verifyToken,getUser)
router.get(":/id", getUsers)


export default router;
