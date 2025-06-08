# Stage 1: Build
FROM node:24 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Runtime
FROM node:24 AS runtime

WORKDIR /backend
COPY --from=build /app ./
