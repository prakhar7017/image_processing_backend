import { Request, Response } from "express";
import multer from "multer";
import CSVService from "../services/csvService";

const upload = multer({ dest: "uploads/" }).single("csvFile"); // ✅ Ensure correct parsing

class UploadController {
  public async uploadCSV(req: Request, res: Response): Promise<void> {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload failed", error: err.message });
      }

      console.log("File:", req.file);
      console.log("Body:", req.body); // ✅ Should now contain webhookUrl

      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const webhookUrl = req.body.webhookUrl; // ✅ Correctly extract from req.body
        const requestId = await CSVService.processCSV(req.file.path, webhookUrl);
        return res.status(200).json({ requestId, message: "Processing started." });
      } catch (error: any) {
        return res.status(500).json({
          requestId: "",
          message: "Processing failed",
          error: error.message,
        });
      }
    });
  }
}

export default new UploadController();
