# Base environment select karne ke liye
FROM alpine:latest

# App directory configuration
WORKDIR /app

# Application environment simulate karne ke liye simple instruction
CMD ["echo", "Share4Good Application Services are Running Successfully!"]