# frontend

Interfície d'usuari de TravelTech Solutions.

**Desplegament: Render**

## Configuració
Edita `public/config.js` amb les URLs reals dels microserveis desplegats:

```js
const CONFIG = {
  FAVORITES_API: 'https://la-teva-url.railway.app',
  WEATHER_API:   'https://la-teva-url.koyeb.app',
  COMMENTS_API:  'https://la-teva-url.onrender.com',
  COUNTRIES_API: 'https://restcountries.com/v3.1'
};
```

## Desplegament a Render
1. Ves a https://render.com
2. New → Web Service → Connect GitHub
3. Root Directory: `frontend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
