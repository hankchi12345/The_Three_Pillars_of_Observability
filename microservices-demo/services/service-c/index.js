const express = require('express');
const promClient = require('prom-client');
const pino = require('pino');
require('./tracing'); // 引入 OpenTelemetry 初始化

const SERVICE_NAME = process.env.SERVICE_NAME || 'service-c';
const PORT = process.env.PORT || 20001;
const LOG_FILE = `/app/logs/${SERVICE_NAME}.log`;

const logger = pino({ level: 'info' }, pino.destination(LOG_FILE));

const app = express();

// 使用 Histogram 來記錄 HTTP 請求的持續時間
const httpRequestHistogram = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// 請求時間計時中介層
app.use((req, res, next) => {
  const end = httpRequestHistogram.startTimer(); // 開始計時
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Hello 路由
app.get('/hello', (req, res) => {
  logger.info(`Hello request received for ${SERVICE_NAME}`);
  res.send(`${SERVICE_NAME} says hello!`);
});

app.listen(PORT, () => {
  logger.info(`Service ${SERVICE_NAME} is running on port ${PORT}`);
});

