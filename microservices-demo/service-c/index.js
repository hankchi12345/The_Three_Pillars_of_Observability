require('./tracing'); // 初始化 OpenTelemetry

const express = require('express');
const app = express();
const port = 3002; // 

app.get('/', (req, res) => {
  res.send('C');
});

app.listen(port, () => {
  console.log(`Service C listening on port ${port}`);
});

