const axios = require('axios');
const { context, propagation } = require('@opentelemetry/api');
const express = require('express');
const promClient = require('prom-client');
const pino = require('pino');
require('./tracing'); // 引入 OpenTelemetry 初始化

const SERVICE_NAME = process.env.SERVICE_NAME || 'service-a';
const PORT = process.env.PORT || 20000;
const LOG_FILE = `/app/logs/${SERVICE_NAME}.log`;

const logger = pino({ level: 'info' }, pino.destination(LOG_FILE));

const app = express();

// 使用 Histogram 來記錄 HTTP 請求的持續時間
const httpRequestHistogram = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5], // 設置請求時間的範圍
});

// 請求時間計時中介層
app.use((req, res, next) => {
  const end = httpRequestHistogram.startTimer(); // 開始計時
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Service A 呼叫 Service B
app.get('/call-b', async (req, res) => {
  try {
    const response = await axios.get('http://service-b:20001/call-c');
    logger.info(`Service A calling B, response: ${response.data}`);
    res.send(`A => ${response.data}`);
  } catch (err) {
    logger.error(`Service B unreachable from A: ${err.message}`);
    res.status(500).send('Service B unreachable');
  }
});

// Hello 路由
app.get('/hello', (req, res) => {
  logger.info(`Hello request received for ${SERVICE_NAME}`);
  res.send(`${SERVICE_NAME} says hello!`);
});

app.listen(PORT, () => {
  logger.info(`Service ${SERVICE_NAME} is running on port ${PORT}`);
});

