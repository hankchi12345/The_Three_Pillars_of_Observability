const express = require('express');
const axios = require('axios');
const app = express();

app.get('/hello', async (req, res) => {
  try {
    const bRes = await axios.get('http://localhost:3001/step2');
    res.send(`A → ${bRes.data}`);
  } catch (err) {
    res.status(500).send('Error in A: ' + err.message);
  }
});

app.listen(3000, () => console.log('Service A running on port 3000'));

