FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest && npm cache clean --force
RUN npm install --omit=dev

COPY . .

# 確保 logs 目錄存在，用於 pino 寫入日誌
RUN mkdir -p logs

EXPOSE 20002

CMD ["npm", "start"]
