// =====================================================
// TravelTech Solutions - Comments Microservice
// Microservei NOU - Comentaris curts per país
// Desplegament: Render | PORT local: 4003
// =====================================================

// Importació de dependències
const express = require('express'); // Framework web per crear el servidor HTTP
const cors = require('cors');       // Middleware per habilitar CORS (Cross-Origin Resource Sharing)
const crypto = require('crypto');   // Mòdul natiu de Node.js per generar IDs únics

// Inicialització de l'aplicació Express
const app = express();
const PORT = process.env.PORT || 4003; // Usa el PORT de l'entorn (cloud) o 4003 en local

// ---- MIDDLEWARES ----
app.use(cors());           // Permet peticions des del frontend (domini diferent)
app.use(express.json());   // Parseja automàticament el body JSON de les peticions

// ---- EMMAGATZEMATGE EN MEMÒRIA ----
let comments = []; // Array que guarda els comentaris mentre el servidor està actiu

// ---- ENDPOINTS ----

// GET /health → Comprova que el servei funciona correctament
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'comments', count: comments.length });
});

// GET /comments → Retorna tots els comentaris (del més recent al més antic)
app.get('/comments', (req, res) => {
  const sorted = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

// GET /comments/country/:name → Filtra comentaris per país
app.get('/comments/country/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const filtered = comments.filter(c => c.country.toLowerCase() === name);
  res.json(filtered);
});

// GET /comments/:id → Retorna un comentari concret per ID
app.get('/comments/:id', (req, res) => {
  const item = comments.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'No trobat' });
  res.json(item);
});

// POST /comments → Afegeix un nou comentari sobre un país
// Body esperat: { country, flag, text }
app.post('/comments', (req, res) => {
  const { country, flag, text } = req.body;

  // Validació: country i text són obligatoris
  if (!country || !text) {
    return res.status(400).json({ error: 'Els camps "country" i "text" són obligatoris' });
  }

  // Limitació de longitud: màxim 280 caràcters
  if (text.length > 280) {
    return res.status(400).json({ error: 'El comentari no pot superar els 280 caràcters' });
  }

  // Creació del nou element amb ID únic i timestamp
  const item = {
    id: crypto.randomUUID(),
    country,
    flag: flag || '',
    text,
    createdAt: new Date().toISOString()
  };

  comments.push(item);
  res.status(201).json(item); // 201 Created
});

// DELETE /comments/:id → Elimina un comentari per ID
app.delete('/comments/:id', (req, res) => {
  const index = comments.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No trobat' });
  comments.splice(index, 1);
  res.json({ message: 'Eliminat correctament' });
});

// ---- ARRENCADA DEL SERVIDOR ----
app.listen(PORT, () => {
  console.log(`Comments service running on port ${PORT}`);
});
