# Stage 1: Build 
FROM node:24 AS build

WORKDIR /app

COPY . .

RUN npm install

# Stage 2: Runtime

FROM node:24 AS runtime

WORKDIR /vite-project
COPY --from=build /app ./
