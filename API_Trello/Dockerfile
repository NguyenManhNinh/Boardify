# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the project (transpile Babel)
RUN npm run build

# Expose the port the app runs on
EXPOSE 8017

# Define the command to run the app
CMD [ "npm", "run", "production" ]
