import axios from "axios";
import ProcessingRequest from "../models/processingRequest.model";

class WebhookService {
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds

  public async sendWebhook(requestId: string): Promise<void> {
    const request = await ProcessingRequest.findOne({ requestId });

    if (!request || !request.webhookUrl) return;

    const payload = {
      requestId: request.requestId,
      status: request.status,
      completedAt: request.completedAt,
      products: request.products,
    };

    let attempt = 0;
    while (attempt < this.maxRetries) {
      try {
        await axios.post(request.webhookUrl, payload);
        request.webhookStatus = "SUCCESS";
        await request.save();
        console.log(`Webhook sent successfully for request ${requestId}`);
        return;
      } catch (error) {
        console.error(`Webhook attempt ${attempt + 1} failed for request ${requestId}`);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }

    request.webhookStatus = "FAILED";
    await request.save();
    console.error(`Webhook failed after ${this.maxRetries} attempts for request ${requestId}`);
  }
}

export default new WebhookService();
