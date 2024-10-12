import express from "express";
import { checkAdminRole } from "../middlewares/rollCheck.middleware.js";
import {
  registerAdmin,
  loginAdmin,
  getAdminAssignments,
  acceptAssignment,
  rejectAssignment,
} from "../controllers/admin.controller.js"

import {verifyJWT}  from '../middlewares/auth.Admin.middleware.js'

const router = express.Router();

router.route("/register").post(registerAdmin);

router.route("/login").post(loginAdmin);

router.route("/assignments/:userId").get( getAdminAssignments);

router.route("/assignments/:id/accept").post(verifyJWT,checkAdminRole, acceptAssignment);

router.route("/assignments/:id/reject").post(verifyJWT , checkAdminRole, rejectAssignment);

export default router;
