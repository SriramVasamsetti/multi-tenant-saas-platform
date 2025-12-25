FROM node:18-alpine
RUN apk add --no-cache netcat-openbsd
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Ensure scripts are executable
RUN chmod +x start.sh
EXPOSE 5000
CMD ["./start.sh"]