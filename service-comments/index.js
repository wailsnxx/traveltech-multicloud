// TravelTech Solutions - Comments Microservice
// Microservei NOU | Desplegament: Render | PORT: 4003

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

let comments = [];

// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'comments', count: comments.length });
});

// GET /comments - Tots els comentaris ordenats per data
app.get('/comments', (req, res) => {
  const sorted = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

// GET /comments/country/:name - Comentaris d'un país concret
app.get('/comments/country/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const filtered = comments.filter(c => c.country.toLowerCase() === name);
  res.json(filtered);
});

// GET /comments/:id
app.get('/comments/:id', (req, res) => {
  const item = comments.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'No trobat' });
  res.json(item);
});

// POST /comments - Afegir comentari { country, flag, text }
app.post('/comments', (req, res) => {
  const { country, flag, text } = req.body;
  if (!country || !text) return res.status(400).json({ error: 'Els camps "country" i "text" són obligatoris' });
  if (text.length > 280) return res.status(400).json({ error: 'Màxim 280 caràcters' });

  const item = {
    id: crypto.randomUUID(),
    country,
    flag: flag || '',
    text,
    createdAt: new Date().toISOString()
  };

  comments.push(item);
  res.status(201).json(item);
});

// DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
  const index = comments.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No trobat' });
  comments.splice(index, 1);
  res.json({ message: 'Eliminat correctament' });
});

app.listen(PORT, () => {
  console.log(`Comments service running on port ${PORT}`);
});
