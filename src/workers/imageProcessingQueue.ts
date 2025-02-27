import WebhookService from "../services/webhookService";
import ImageProcessor from "../services/imageProcessor";
import ProcessingRequest from "../models/processingRequest.model";
import { Queue, Worker, Job } from "bullmq";
import { createClient } from "redis";
import imageService from "../services/imageService";

const connection = { host: "127.0.0.1", port: 6379 };

class ImageProcessingQueue {
  private queue: Queue;

  constructor() {
    this.queue = new Queue("imageQueue", { connection });
    this.processQueue();
  }

  public addJob(requestId: string) {
    this.queue.add("processImages", { requestId });
  }

  private processQueue() {
    new Worker(
      "imageQueue",
      async (job: Job) => {
        const { requestId } = job.data;
        const request = await ProcessingRequest.findOne({ requestId });

        if (!request) return;
        request.status = "PROCESSING";
        await request.save();

        for (const product of request.products) {
          for (let i = 0; i < product.inputImageUrls.length; i++) {
            const outputImage = await ImageProcessor.compressImage(product.inputImageUrls[i]);
            const outputImageUrl=await imageService.uploadImage(outputImage);
            product.outputImageUrls.push(outputImageUrl);
          }
        }

        request.status = "COMPLETED";
        request.completedAt = new Date();
        await request.save();

        // Trigger webhook
        WebhookService.sendWebhook(requestId);
      },
      { connection }
    );
  }
}

export default new ImageProcessingQueue();
