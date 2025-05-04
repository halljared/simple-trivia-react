# Stage 1: Build the application
FROM node:lts-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
# Use 'npm ci' for potentially faster and more reliable installs in CI/CD
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application for production
# Vite uses .env.production variables during this build step
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional but recommended for SPAs)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
