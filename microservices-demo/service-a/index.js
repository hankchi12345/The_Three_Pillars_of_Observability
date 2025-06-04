require('./tracing'); // åˆå§‹åŒ– tracing

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// í ½í´½ é€™æ®µæ˜¯é—œéµï¼Œå®šç¾© GET /
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3001');
    res.send(`A -> ${response.data}`);
  } catch (error) {
    console.error('Error calling service B:', error);
    res.status(500).send('Service A Error');
  }
});

app.listen(port, () => {
  console.log(`A running at ${port}`);
});

