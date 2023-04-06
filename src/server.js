// Remove the following line
//const fetch = require('node-fetch');
require('dotenv').config();

const express = require('express');
const path = require('path');
const { join } = require('path');


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(join(__dirname, '../data/vocabulary.db'));
db.run('CREATE TABLE IF NOT EXISTS vocabulary (id INTEGER PRIMARY KEY, word TEXT, language TEXT)');

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
      console.log(json);
    } catch (error) {
      res.status(500).send({ message: 'Error making request to OpenAI API' });
    }
  });
  
// set up the SQLite database endpoint - to save words to the database
  app.post('/api/save-word', (req, res) => {
    const { word, language } = req.body;
  
    const stmt = db.prepare('INSERT INTO vocabulary (word, language) VALUES (?, ?)');
    stmt.run(word, language, (err) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).send({ message: 'Word saved successfully' });
      }
    });
    stmt.finalize();
  });
  
// fetch words from the database

app.get('/api/get-words', (req, res) => {
    db.all('SELECT * FROM vocabulary', [], (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).send({ words: rows });
      }
    });
  });


// Delete a word from the database
app.delete("/api/delete-word/:id", async (req, res) => {
    const { id } = req.params;
    // Delete the word from the database using the 'id'
    const stmt = db.prepare("DELETE FROM vocabulary WHERE id = ?");
    stmt.run(id, (err) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).json({ message: "Word deleted successfully" });
      }
    });
    stmt.finalize();
  });
  
  
  


//start the port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
