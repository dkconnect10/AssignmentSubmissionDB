import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';
import { Admin } from "../models/admin.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log('Token:', token);  // Log the token received

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Decoded Token:', decodedToken);  // Log the decoded token

        const admin = await Admin.findById(decodedToken._id).select("-password -refreshToken");
        console.log('Admin found:', admin); // Log the admin found

        if (!admin) {
            console.log('Admin not found for ID:', decodedToken._id);
            throw new ApiError(401, "Invalid Access Token: Admin not found");
        }

        req.admin = admin; // Attach admin info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error:', error); // Log the error
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

export { verifyJWT };
