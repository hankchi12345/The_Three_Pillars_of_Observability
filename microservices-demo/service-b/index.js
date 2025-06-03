const express = require('express');
const axios = require('axios');
const app = express();

app.get('/step2', async (req, res) => {
  try {
    const cRes = await axios.get('http://localhost:3002/step3');
    res.send(`B → ${cRes.data}`);
  } catch (err) {
    res.status(500).send('Error in B: ' + err.message);
  }
});

app.listen(3001, () => console.log('Service B running on port 3001'));

