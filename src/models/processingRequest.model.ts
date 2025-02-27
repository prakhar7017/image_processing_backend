import mongoose, { Schema, Document } from "mongoose";

export interface IProcessingRequest extends Document {
  requestId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  products: {
    serialNumber: number;
    productName: string;
    inputImageUrls: string[];
    outputImageUrls: string[];
  }[];
  createdAt: Date;
  completedAt?: Date;
  webhookUrl?: string;
  webhookStatus?: "SUCCESS" | "FAILED";
}

const ProcessingRequestSchema = new Schema<IProcessingRequest>(
  {
    requestId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    webhookUrl: { type: String },
    webhookStatus: { type: String },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    products: [
      {
        serialNumber: { type: Number, required: true },
        productName: { type: String, required: true },
        inputImageUrls: { type: [String], required: true },
        outputImageUrls: { type: [String], required: true },
      },
    ],
  },
  { timestamps: true }
);

const ProcessingRequest = mongoose.model<IProcessingRequest>(
  "ProcessingRequest",
  ProcessingRequestSchema
);

export default ProcessingRequest;
