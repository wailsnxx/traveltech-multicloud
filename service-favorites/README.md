# service-favorites

Microservei de favorits. Adaptat del projecte TravelTech anterior.

**Desplegament: Railway**

## Endpoints
- `GET /health`
- `GET /favorites`
- `POST /favorites` → `{ name, capital, region, flag }`
- `DELETE /favorites/:id`

## Desplegament a Railway
1. Ves a https://railway.app i crea un compte
2. New Project → Deploy from GitHub repo
3. Selecciona el repositori i la carpeta `service-favorites`
4. Railway detecta automàticament Node.js i executa `npm start`
5. Copia la URL pública i enganxa-la a `frontend/public/config.js` → `FAVORITES_API`
