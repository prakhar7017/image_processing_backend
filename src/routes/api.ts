import express from "express";
import UploadController from "../controllers/uploadController"; 
import StatusController from "../controllers/statusController"; 
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload",UploadController.uploadCSV);
router.get("/status/:requestId", (req, res) => StatusController.checkStatus(req, res));

export default router;
