import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import  {Assignment} from '../models/assignment.model.js'

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(404, "email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "invalid password please give crreact password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, refreshToken, accessToken },
        "User logged in successfully"
      )
    );
});

const uploadAssignment = asyncHandler(async (req,res) => {
  const { userId, task, admin } = req.body;

  const  file  = req.file;

  if (!file) {
    throw new ApiError(400, "file is required  ");
  }

  const fileLocalPath = file.path

  const fileUploadonCloudinary = await uploadOnCloudinary(fileLocalPath);

  if (!fileUploadonCloudinary) {
    throw new ApiError(500, "file not uploaded on cloudinary ");
  }

  const assignment = await new Assignment({
    userId,
    task,
    admin,
    file: fileUploadonCloudinary.url || "",
  }).save();

  if (!assignment) {
    throw new ApiError(
      500,
      "something went wrong while crateing new Assignment"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, assignment, "Assignement upload successfully"));
});

export { registerUser, loginUser, uploadAssignment };

// Upload an assignment
// exports.uploadAssignment = async (req, res) => {
//   try {
//       const { userId, task, admin } = req.body;
//       const newAssignment = new Assignment({ userId, task, admin });
//       await newAssignment.save();
//       res.status(201).json({ message: 'Assignment uploaded successfully!' });
//   } catch (error) {
//       res.status(400).json({ error: 'Failed to upload assignment. Please try again.' });
//   }
// };
