# Use node:latest as the builder image
FROM node:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and install app dependencies
COPY package.json .
RUN npm install --legacy-peer-deps

# Copy other project files and build
COPY . ./
RUN npm run build

# use nginx to serve the app
FROM nginx:latest

# Overwrite default nginx config with ours
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy over the build files from the builder image
COPY --from=builder /app/dist /usr/share/nginx/html

# Set the working directory
WORKDIR /usr/share/nginx/html

# Start nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]