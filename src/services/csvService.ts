import multer from "multer";
import * as csvParser from "fast-csv";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import ProcessingRequest, { IProcessingRequest } from "../models/processingRequest.model";
import ImageProcessingQueue from "../workers/imageProcessingQueue";

class CSVService {
  private storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });

  public upload = multer({ storage: this.storage }).single("file");

  public async processCSV(filePath: string, webhookUrl?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const requestId = uuidv4();
      const products: IProcessingRequest["products"] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser.parse({ headers: true }))
        .on("data", (row) => {
          products.push({
            serialNumber: parseInt(row["S. No."], 10),
            productName: row["Product Name"],
            inputImageUrls: row["Input Image Urls"].split(",").map((url:string) => url.trim()),
            outputImageUrls: [],
          });
        })
        .on("end", async () => {
          const request = new ProcessingRequest({ requestId, webhookUrl, products });
          await request.save();
          ImageProcessingQueue.addJob(requestId);
          resolve(requestId);
        })
        .on("error", (error) => reject(error));
    });
  }
}

export default new CSVService();
