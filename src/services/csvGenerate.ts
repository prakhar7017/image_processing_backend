import fs from "fs/promises"; 
import path from "path";
import { IProcessingRequest } from "../models/processingRequest.model";

export const generateCSV = async (request: IProcessingRequest): Promise<string> => {
  try {
    const outputDir = path.join(__dirname, "../../output");
    const filePath = path.join(outputDir, `${request.requestId}.csv`);

    
    await fs.mkdir(outputDir, { recursive: true });

    const csvData = ["S. No.,Product Name,Input Image Urls,Output Image Urls"];

    request.products.forEach((product) => {
      const inputUrls = product.inputImageUrls.join(", ");
      const outputUrls = product.outputImageUrls.join(", ");
      csvData.push(
        `${product.serialNumber},${product.productName},"${inputUrls}","${outputUrls}"`
      );
    });

    await fs.writeFile(filePath, csvData.join("\n"));
    return filePath;
  } catch (error) {
    console.error("Error generating CSV:", error);
    throw new Error("CSV generation failed");
  }
};
