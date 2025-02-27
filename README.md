# **📂 CSV Processing API**  

🚀 A **Node.js & Express**-based backend that allows users to upload a CSV file, process it asynchronously, and download the processed data.  

## **📌 Features**  
✅ Upload CSV files using **Multer**  
✅ Asynchronous processing of uploaded CSV files  
✅ Retrieve processing status using `requestId`  
✅ Download processed CSV files  
✅ Webhook support for real-time status updates  
✅ MongoDB integration for request tracking  

## **🛠 Tech Stack**  
- **Backend:** Node.js (Express.js)  
- **Database:** MongoDB (Mongoose ORM)  
- **File Handling:** Multer  
- **CSV Processing:** Custom service  
- **Storage:** Local file system  

---

## **📂 Project Structure**  
/src ├── controllers/ # Handles API requests │ ├── uploadController.ts │ ├── statusController.ts │ ├── services/ # Business logic & processing │ ├── csvService.ts │ ├── csvGenerate.ts │ ├── models/ # MongoDB models │ ├── processingRequest.model.ts │ ├── routes/ # API endpoints │ ├── api.ts │ ├── config/ # Database configuration │ ├── db.ts │ ├── uploads/ # Temporary CSV file storage ├── output/ # Processed CSV files ├── .env # Environment variables ├── package.json # Dependencies & scripts ├── README.md # Documentation


---

## **📦 Installation & Setup**  
### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/prakhar7017/image_processing_backend.git
cd image_processing_backend
