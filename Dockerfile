# -------------------------
# 1. Build stage (Node)
# -------------------------
FROM node:20 as build

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build Vite app
RUN npm run build


# -------------------------
# 2. Production stage (Nginx)
# -------------------------
FROM nginx:alpine

# Copy built files into nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run expects port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]