# Use official Node.js image as base
FROM node:20-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and remove unnecessary files to reduce image size
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "run", "start"]
