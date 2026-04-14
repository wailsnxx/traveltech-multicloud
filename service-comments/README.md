# service-comments

Microservei de comentaris. Microservei completament nou.

**Desplegament: Render**

## Endpoints
- `GET /health`
- `GET /comments`
- `GET /comments/country/:name`
- `POST /comments` → `{ country, flag, text }`
- `DELETE /comments/:id`

## Desplegament a Render
1. Ves a https://render.com i crea un compte
2. New → Web Service → Connect GitHub
3. Selecciona el repositori, Branch: `main`
4. Root Directory: `service-comments`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Copia la URL pública i enganxa-la a `frontend/public/config.js` → `COMMENTS_API`
