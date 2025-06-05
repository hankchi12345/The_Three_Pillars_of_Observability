const express = require('express');
const axios = require('axios');
const promClient = require('prom-client');
require('./tracing'); // OpenTelemetry 初始化

const app = express();
const port = 3000;

// Prometheus Counter
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: '總共的 HTTP 請求次數',
  labelNames: ['method', 'route'],
});

app.use((req, res, next) => {
  httpRequestCounter.inc({ method: req.method, route: req.path });
  next();
});

// Metrics Endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// 主業務路由
app.get('/call-b', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3001/call-c');
    res.send(`A => ${response.data}`);
  } catch (err) {
    res.status(500).send('Service B unreachable');
  }
});

app.listen(port, () => {
  console.log(`A running at ${port}`);
});

