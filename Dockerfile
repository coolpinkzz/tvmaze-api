# Use the official Node.js 18 image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Compile TypeScript code
RUN npx tsc

# Expose the application port
EXPOSE 3000

# Set environment variables for MongoDB
ENV MONGO_URI=mongodb://your-mongodb-uri:27017

# Start the application
CMD ["node", "dist/index.js"]
