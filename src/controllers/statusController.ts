import { Request, Response } from "express";
import ProcessingRequest from "../models/processingRequest.model";
import { generateCSV } from "../services/csvGenerate";
import fs from "fs";

class StatusController {
  public async checkStatus(req: Request, res: Response): Promise<void> {
    try {
      const request = await ProcessingRequest.findOne({ requestId: req.params.requestId });

      if (!request) {
        res.status(404).json({ error: "Request not found" });
        return;
      }

      if (request.status === "COMPLETED") {
        const csvFilePath = await generateCSV(request);

        // Check if file exists before downloading
        if (fs.existsSync(csvFilePath)) {
          res.setHeader("Content-Disposition", `attachment; filename=result-${request.requestId}.csv`);
          res.setHeader("Content-Type", "csv");
          res.download(csvFilePath, `${request.requestId}.csv`, (err) => {
            if (err) {
              console.error("Error sending file:", err);
              res.status(500).json({ error: "Failed to download the file" });
            }
          });
        } else {
          res.status(500).json({ error: "CSV file generation failed" });
        }
        return;
      }

      res.json({ requestId: request.requestId, status: request.status });
    } catch (error: any) {
      console.error("Error checking status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new StatusController();
