# Use Node.js image to build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build

# Use a lightweight web server (nginx) to serve the built files
FROM nginx:alpine

# Copy the built app to nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default for nginx)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]