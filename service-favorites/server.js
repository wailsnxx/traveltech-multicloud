// =====================================================
// TravelTech Solutions - Favorites Microservice
// PORT: 4001 (local) | Desplegament: Railway
// =====================================================

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Emmagatzematge en memòria
let favorites = [];

// GET /health - Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'favorites', count: favorites.length });
});

// GET /favorites - Obtenir tots els favorits
app.get('/favorites', (req, res) => {
  res.json(favorites);
});

// GET /favorites/:id - Obtenir un favorit per ID
app.get('/favorites/:id', (req, res) => {
  const item = favorites.find(f => f.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'No trobat' });
  res.json(item);
});

// POST /favorites - Afegir un favorit
app.post('/favorites', (req, res) => {
  const { name, capital, region, flag } = req.body;
  if (!name) return res.status(400).json({ error: 'El camp "name" és obligatori' });

  // Evitar duplicats
  const exists = favorites.find(f => f.name.toLowerCase() === name.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Aquest país ja és a la llista de favorits' });

  const item = {
    id: crypto.randomUUID(),
    name,
    capital: capital || '',
    region: region || '',
    flag: flag || '',
    createdAt: new Date().toISOString()
  };

  favorites.push(item);
  res.status(201).json(item);
});

// DELETE /favorites/:id - Eliminar un favorit
app.delete('/favorites/:id', (req, res) => {
  const index = favorites.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No trobat' });
  favorites.splice(index, 1);
  res.json({ message: 'Eliminat correctament' });
});

app.listen(PORT, () => {
  console.log(`Favorites service running on port ${PORT}`);
});
