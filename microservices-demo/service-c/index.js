require('./tracing'); //(第三章 會用到一、二章可以先註解掉這一行)
const express = require('express');
const app = express();

app.get('/step3', (req, res) => {
  res.send('C');
});

app.listen(3002, () => console.log('Service C running on port 3002'));
