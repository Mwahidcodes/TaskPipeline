# Base image node select ki
FROM node:18-alpine

# Container ke andar working directory set ki
WORKDIR /usr/src/app

# Dependencies copy aur install kiye
COPY package*.json ./
RUN npm install

# Baqi saara backend code copy kiya
COPY . .

# Server port expose kiya
EXPOSE 5000

# App chalane ki command
CMD ["npm", "run", "dev"]