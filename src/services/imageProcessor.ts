import axios from "axios";
import sharp from "sharp";
import fs from "fs";

class ImageProcessor {
  public async compressImage(imageUrl: string): Promise<string> {
    const response = await axios({ url: imageUrl, responseType: "arraybuffer" });
    const inputBuffer = Buffer.from(response.data);
    const outputPath = `./uploads/compressed-${Date.now()}.jpg`;

    await sharp(inputBuffer)
      .jpeg({ quality: 50 })
      .toFile(outputPath);

    return outputPath;
  }
}

export default new ImageProcessor();
