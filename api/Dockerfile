# Backend Dockerfile for Express/Node.js API
#
# To build the image:
# docker build -t docker-sample-api .
#
# To run the container:
# docker run -p 3000:3000 docker-sample-api
#
# To run with environment variables:
# docker run -p 3000:3000 --env-file .env docker-sample-api
#
# Access the API at: http://localhost:3000

# Use Node.js 24 as the base image
FROM node:24

# Set the working directory inside the container
WORKDIR /app

# curl is required by the Docker healthcheck
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (if available)
COPY package*.json ./   

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the application using npm run dev which starts it with nodemon
CMD ["npm", "run", "dev"]