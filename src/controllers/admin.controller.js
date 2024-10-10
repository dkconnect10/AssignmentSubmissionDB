import Admin from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Assignment } from "../models/assignment.model.js";
import bcrypt from "bcrypt";

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if ([email, password, name].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All fildes are required");
  }

  const existedAdmin = await Admin.findOne({ email });

  if (existedAdmin) {
    throw new ApiError(409, "Admin already exists");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  const createdAdmin = await Admin.findById(admin._id).select("-password");

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the Admin");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdAdmin, "Admin registered Successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(404, "email is required");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }

  const isPasswordValid = await Admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "invalid password please give crreact password");
  }

  const loggedAdmin = await Admin.findById(admin._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, loggedAdmin, "User logged in successfully"));
});

const getAdminAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ admin: req.user._id });

  if (!assignments) {
    throw new ApiError(400, "assignment not found");
  }
  return res
    .status(200)
    .json(200, assignments, "Assignments find successfully ");
});

const acceptAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(
    req.params._id,
    { status: "accepted" },
    { new: true }
  );

  if (!assignment) {
    throw new ApiError(400, "Assigment not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, assignment, "Assignment accepted"));
});

const rejectAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(
    req.params._id,
    { status: "rejected" },
    { new: true }
  );

  if (!assignment) {
    throw new ApiError(400, "assignment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, assignment, "Assignment rejected"));
});
export { registerAdmin, loginAdmin, getAdminAssignments, acceptAssignment,rejectAssignment };
