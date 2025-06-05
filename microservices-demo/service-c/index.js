const express = require('express');
const promClient = require('prom-client');
require('./tracing'); // OpenTelemetry 初始化

const app = express();
const port = 3002;

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: '總共的 HTTP 請求次數',
  labelNames: ['method', 'route'],
});

app.use((req, res, next) => {
  httpRequestCounter.inc({ method: req.method, route: req.path });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.get('/', (req, res) => {
  res.send('Hello from C!');
});

app.listen(port, () => {
  console.log(`Service C listening on port ${port}`);
});

