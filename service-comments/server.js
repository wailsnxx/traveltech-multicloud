// =====================================================
// TravelTech Solutions - Comments Microservice
// Microservei NOU
// PORT: 4003 (local) | Desplegament: Render
// =====================================================

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

// Emmagatzematge en memòria
let comments = [];

// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'comments', count: comments.length });
});

// GET /comments - Tots els comentaris
app.get('/comments', (req, res) => {
  // Ordenats del més recent al més antic
  const sorted = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

// GET /comments/country/:name - Comentaris d'un país concret
app.get('/comments/country/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const filtered = comments.filter(c => c.country.toLowerCase() === name);
  res.json(filtered);
});

// GET /comments/:id - Un comentari per ID
app.get('/comments/:id', (req, res) => {
  const item = comments.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'No trobat' });
  res.json(item);
});

// POST /comments - Afegir un comentari
app.post('/comments', (req, res) => {
  const { country, flag, text } = req.body;
  if (!country || !text) {
    return res.status(400).json({ error: 'Els camps "country" i "text" són obligatoris' });
  }
  if (text.length > 280) {
    return res.status(400).json({ error: 'El comentari no pot superar els 280 caràcters' });
  }

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

// DELETE /comments/:id - Eliminar un comentari
app.delete('/comments/:id', (req, res) => {
  const index = comments.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No trobat' });
  comments.splice(index, 1);
  res.json({ message: 'Eliminat correctament' });
});

app.listen(PORT, () => {
  console.log(`Comments service running on port ${PORT}`);
});
