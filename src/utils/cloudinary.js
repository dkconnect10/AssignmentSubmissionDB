import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadONCloudinary = async (uploadFilePath) => {
  try {
    if (!uploadFilePath) return null;
    const response = await cloudinary.uploader.upload(uploadFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(uploadFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(uploadFilePath);
    return null;
  }
};

export {uploadONCloudinary}