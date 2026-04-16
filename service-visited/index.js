// TravelTech Solutions - Visited Microservice
// Microservei NOU | Desplegament: Vercel | PORT: 4002

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

let visited = [];

// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'visited', count: visited.length });
});

// GET /visited - Tots els països visitats
app.get('/visited', (req, res) => {
  res.json(visited);
});

// POST /visited - Marcar un país com a visitat { name, capital, region, flag }
app.post('/visited', (req, res) => {
  const { name, capital, region, flag } = req.body;
  if (!name) return res.status(400).json({ error: 'El camp "name" és obligatori' });

  // Evitar duplicats
  const exists = visited.find(v => v.name.toLowerCase() === name.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Aquest país ja està marcat com a visitat' });

  const item = {
    id: crypto.randomUUID(),
    name,
    capital: capital || '',
    region: region || '',
    flag: flag || '',
    visitedAt: new Date().toISOString()
  };

  visited.push(item);
  res.status(201).json(item);
});

// DELETE /visited/:id
app.delete('/visited/:id', (req, res) => {
  const index = visited.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No trobat' });
  visited.splice(index, 1);
  res.json({ message: 'Eliminat correctament' });
});

app.listen(PORT, () => {
  console.log(`Visited service running on port ${PORT}`);
});
