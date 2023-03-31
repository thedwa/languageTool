// Remove the following line
// const fetch = require('node-fetch');
require('dotenv').config();



const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/gapText.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gapText.html'));
  });

app.use(express.json());


app.post('/api/generate-gap-text', async (req, res) => {
    const data = req.body;
  
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(data),
      });
  
      const json = await response.json();
      res.send(json);
    } catch (error) {
      res.status(500).send({ message: 'Error making request to OpenAI API' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
