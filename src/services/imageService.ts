import cloudinary from "../config/cloudinary";
import fs from "fs";

class ImageService {
  public async uploadImage(localFilePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(localFilePath,{
        folder: "compressed-images",
        use_filename: true,
        resource_type: "auto",
      });
      return result.secure_url;
    } catch (error) {
      console.error("Image Upload Error:", error);
      return "";
    }
  }
}

export default new ImageService();
