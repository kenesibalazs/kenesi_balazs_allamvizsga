# Stage 1: Build 
FROM node:24 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Runtime - Dockeres kompót verziónk

#FROM node:24 AS runtime

#WORKDIR /vite-project
#COPY --from=build /app ./

# Stage 2: Serve with nginx
FROM nginx:stable-alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
