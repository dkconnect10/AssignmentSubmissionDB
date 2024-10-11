import express from "express";
import { checkAdminRole } from "../middlewares/rollCheck.middleware.js";
import {
  registerAdmin,
  loginAdmin,
  getAdminAssignments,
  acceptAssignment,
  rejectAssignment,
} from "../controllers/admin.controller.js"

const router = express.Router();

router.route("/register").post(registerAdmin);

router.route("/login").post(loginAdmin);

router.route("/assignments").get(checkAdminRole, getAdminAssignments);

router.route("/assignments/:id/accept").post(checkAdminRole, acceptAssignment);

router.route("/assignments/:id/reject").post(checkAdminRole, rejectAssignment);

export default router;
