# frontend/Dockerfile
# Use the Node.js image to build the app
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code and build the project
COPY . .
RUN npm run build

# Use a lightweight web server to serve the frontend
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
