# 1. Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Ye command production build banayegi
RUN npm run build 

# 2. Production stage (Nginx)
FROM nginx:alpine
# Build output ko nginx ki folder mein copy karein
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]