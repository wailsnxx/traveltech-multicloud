# service-weather

Microservei meteorològic. Adaptat de weather-api.

**Desplegament: Koyeb**

## Endpoints
- `GET /health`
- `GET /weather/:city` → temperatura, descripció, humitat, vent

## Variable d'entorn (opcional)
- `WEATHER_API_KEY` → clau d'OpenWeatherMap (per defecte usa la del codi)

## Desplegament a Koyeb
1. Ves a https://www.koyeb.com i crea un compte
2. Create App → GitHub
3. Selecciona el repositori i la carpeta `service-weather`
4. Run command: `node server.js`
5. Port: `8000` (Koyeb assigna PORT automàticament via variable d'entorn)
6. Copia la URL pública i enganxa-la a `frontend/public/config.js` → `WEATHER_API`
