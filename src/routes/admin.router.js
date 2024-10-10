import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminAssignments,
  acceptAssignment,
  rejectAssignment,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.get("/assignments", getAdminAssignments);

router.post("/assignments/:id/accept",acceptAssignment);

router.post("/assignments/:id/reject",rejectAssignment);

export default router;
