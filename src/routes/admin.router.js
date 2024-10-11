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

router.route("/assignments").get(verifyJWT,checkAdminRole, getAdminAssignments);

// router.get('/api/v2/admins/assignments/:userId', verifyJWT, checkAdminRole, getAdminAssignments);


router.route("/assignments/:id/accept").post(verifyJWT,checkAdminRole, acceptAssignment);

router.route("/assignments/:id/reject").post(verifyJWT , checkAdminRole, rejectAssignment);

export default router;
