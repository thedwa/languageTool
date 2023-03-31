const express = require('express');
let fetch;
(async () => {
  fetch = await import('node-fetch').then(module => module.default);
})();

const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/api/generate-gap-text', async (req, res) => {
  const data = req.body;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
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
