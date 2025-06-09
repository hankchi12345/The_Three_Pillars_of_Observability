// 引入必要的套件
const express = require('express');
const axios = require('axios');
const promClient = require('prom-client');
const winston = require('winston');
const app = express();

// 配置 Prometheus histogram 來計量 HTTP 請求的延遲時間
const httpRequestHistogram = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// 配置 winston 記錄日誌
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// 請求計時中介層
app.use((req, res, next) => {
  const end = httpRequestHistogram.startTimer(); // 開始計時
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// 呼叫 Service C 的路由
app.get('/call-c', async (req, res) => {
  try {
    const response = await axios.get('http://service-c:20002/hello');
    logger.info(`Service B calling C, response: ${response.data}`);
    res.send(`B => ${response.data}`);
  } catch (err) {
    logger.error(`Service C unreachable from B: ${err.message}`);
    res.status(500).send('Service C unreachable');
  }
});

// 服務的健康檢查路由
app.get('/hello', (req, res) => {
  logger.info(`Hello request received for service-b`);
  res.send('service-b says hello!');
});

// Prometheus 監控路由
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// 啟動服務
const PORT = process.env.PORT || 20001;
app.listen(PORT, () => {
  logger.info(`Service B is running on port ${PORT}`);
});

