// =====================================================
// TravelTech Solutions - Visited Microservice
// Microservei NOU - Registre de països ja visitats
// Desplegament: Vercel | PORT local: 4002
// =====================================================

// Importació de dependències
const express = require('express'); // Framework web per crear el servidor HTTP
const cors = require('cors');       // Middleware per habilitar CORS (Cross-Origin Resource Sharing)
const crypto = require('crypto');   // Mòdul natiu de Node.js per generar IDs únics

// Inicialització de l'aplicació Express
const app = express();
const PORT = process.env.PORT || 4002; // Usa el PORT de l'entorn (cloud) o 4002 en local

// ---- MIDDLEWARES ----
app.use(cors());           // Permet peticions des del frontend (domini diferent)
app.use(express.json());   // Parseja automàticament el body JSON de les peticions

// ---- EMMAGATZEMATGE EN MEMÒRIA ----
let visited = []; // Array que guarda els països visitats mentre el servidor està actiu

// ---- ENDPOINTS ----

// GET /health → Comprova que el servei funciona correctament
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'visited', count: visited.length });
});

// GET /visited → Retorna la llista completa de països visitats
app.get('/visited', (req, res) => {
  res.json(visited);
});

// POST /visited → Marca un nou país com a visitat
// Body esperat: { name, capital, region, flag }
app.post('/visited', (req, res) => {
  const { name, capital, region, flag } = req.body;

  // Validació: el nom és obligatori
  if (!name) return res.status(400).json({ error: 'El camp "name" és obligatori' });

  // Evitar duplicats: no es pot marcar el mateix país dues vegades
  const exists = visited.find(v => v.name.toLowerCase() === name.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Aquest país ja està marcat com a visitat' });

  // Creació del nou element amb ID únic i timestamp
  const item = {
    id: crypto.randomUUID(),
    name,
    capital: capital || '',
    region: region || '',
    flag: flag || '',
    visitedAt: new Date().toISOString()
  };

  visited.push(item);
  res.status(201).json(item); // 201 Created
});

// DELETE /visited/:id → Elimina un país de la llista de visitats
app.delete('/visited/:id', (req, res) => {
  const index = visited.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No trobat' });
  visited.splice(index, 1);
  res.json({ message: 'Eliminat correctament' });
});

// ---- ARRENCADA DEL SERVIDOR ----
app.listen(PORT, () => {
  console.log(`Visited service running on port ${PORT}`);
});
