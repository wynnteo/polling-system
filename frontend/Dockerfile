# Use Node.js base image to build the React app
FROM node:16 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# Serve the app using a static server
FROM nginx:alpine

# Copy build files to Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port for the frontend
EXPOSE 80

# Run Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]