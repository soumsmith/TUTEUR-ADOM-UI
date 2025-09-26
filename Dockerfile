# Fetching the latest node image on Alpine Linux
FROM node:alpine AS builder

# Install required dependencies for building
RUN apk add --no-cache git openssh python3 make g++

# Setting up the work directory
WORKDIR /app

# Copying package.json and package-lock.json from the UI directory to install dependencies
COPY tuteur-adom-ui/package.json tuteur-adom-ui/package-lock.json ./

# Installing ALL dependencies (including devDependencies for build)
RUN npm ci

# Copying all the files from the UI directory
COPY tuteur-adom-ui/ .

# Set NODE_ENV for production build
ENV NODE_ENV=production

# Set production environment variables for Vite
#ENV VITE_API_URL=""
ENV API_BASE_URL=""

# Building our application
RUN npm run build



# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 3000
