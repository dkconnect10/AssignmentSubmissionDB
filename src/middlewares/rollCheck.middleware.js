import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const checkAdminRole = asyncHandler(async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    }
  } catch (error) {
    throw new ApiError(error?.message || " Access denied ");
  }
});


export {checkAdminRole}