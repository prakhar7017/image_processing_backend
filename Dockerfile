# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]
