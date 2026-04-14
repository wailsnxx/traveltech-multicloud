# TravelTech Solutions - Arquitectura Multi-Cloud

Plataforma web de planificació de viatges amb arquitectura de microserveis desplegats en múltiples operadors cloud.

## Arquitectura

| Component | Tecnologia | Cloud | Port local |
|-----------|-----------|-------|------------|
| **Frontend** | Node.js + Express | Render | 3000 |
| **service-favorites** | Node.js + Express | Railway | 4001 |
| **service-weather** | Node.js + Express + OpenWeatherMap | Koyeb | 4002 |
| **service-comments** | Node.js + Express | Render | 4003 |

## API externa
- **REST Countries API** → `https://restcountries.com/v3.1` (sense API key)

## Microserveis

### service-favorites (reutilitzat/adaptat)
Adaptat del projecte TravelTech anterior. Permet guardar i eliminar països favorits.
- `GET /favorites` → Llistar tots els favorits
- `POST /favorites` → Afegir un favorit `{ name, capital, region, flag }`
- `DELETE /favorites/:id` → Eliminar un favorit

### service-weather (nou)
Adaptat de weather-api. Consulta el temps en temps real per a la capital del país cercat.
- `GET /weather/:city` → Obtenir meteorologia d'una ciutat
- `GET /health` → Health check

### service-comments (nou)
Microservei completament nou. Permet escriure comentaris sobre un país.
- `GET /comments` → Llistar tots els comentaris
- `POST /comments` → Afegir un comentari `{ country, flag, text }`
- `DELETE /comments/:id` → Eliminar un comentari

## Execució local

```bash
# Instal·lar dependències (fer-ho a cada carpeta)
cd frontend && npm install
cd ../service-favorites && npm install
cd ../service-weather && npm install
cd ../service-comments && npm install

# Executar cada servei en una terminal diferent
cd frontend && npm start          # http://localhost:3000
cd service-favorites && npm start  # http://localhost:4001
cd service-weather && npm start    # http://localhost:4002
cd service-comments && npm start   # http://localhost:4003
```

Actualitza les URLs a `frontend/public/config.js` amb les URLs dels teus desplegaments.

## Desplegament

Cada component es desplega de forma independent. Vegeu els README de cada carpeta.
