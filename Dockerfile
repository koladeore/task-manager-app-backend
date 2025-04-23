# Use a lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the app port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
