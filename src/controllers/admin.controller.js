import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Assignment } from "../models/assignment.model.js";

const generateacccessTokenAndrefreshToken = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generateacccessTokenAndrefreshToken"
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if ([email, password, name].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fildes are required");
  }

  const existedAdmin = await Admin.findOne({ email });

  if (existedAdmin) {
    throw new ApiError(409, "Admin already exists");
  }

  const admin = await Admin.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
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

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "invalid password please give crreact password");
  }
  const { accessToken, refreshToken } = generateacccessTokenAndrefreshToken(
    admin._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  const loggedAdmin = await Admin.findById(admin._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { admin: loggedAdmin, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const getAdminAssignments = asyncHandler(async (req, res) => {
  const { userId } = req.params

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const assignments = await Assignment.find({ user: userId });

  if (!assignments || assignments.length === 0) {
    throw new ApiError(404, "Assignments not found for the specified user");
  }

  return res.status(200).json({
    status: 200,
    data: assignments,
    message: "Assignments retrieved successfully",
  });
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
export {
  registerAdmin,
  loginAdmin,
  getAdminAssignments,
  acceptAssignment,
  rejectAssignment,
};
