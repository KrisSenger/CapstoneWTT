# Step 1: Build the React app using Vite
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the app
FROM node:18 AS production

WORKDIR /app

# install static file server
RUN npm install -g serve
COPY --from=build /app/dist /app/dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]