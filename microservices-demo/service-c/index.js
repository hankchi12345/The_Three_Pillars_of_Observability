const express = require('express');
const app = express();

app.get('/step3', (req, res) => {
  res.send('C');
});

app.listen(3002, () => console.log('Service C running on port 3002'));

