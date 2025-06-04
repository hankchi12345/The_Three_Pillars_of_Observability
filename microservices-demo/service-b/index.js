require('./tracing');

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3002');
    res.send(`B -> ${response.data}`);
  } catch (error) {
    console.error('Error calling service C:', error);
    res.status(500).send('Service B Error');
  }
});

app.listen(port, () => {
  console.log(`Service B listening on port ${port}`);
});

