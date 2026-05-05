

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4002;
const API_KEY = process.env.WEATHER_API_KEY || '86d9b5b55414e6d28e6f7dc7e946f124';

app.use(cors());
app.use(express.json());

// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'weather' });
});

// GET /weather/:city - Obtenir el temps d'una ciutat
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ca`
    );

    res.json({
      city: response.data.name,
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Ciutat no trobada' });
    }
    res.status(500).json({ error: 'Error amb el servei meteorològic' });
  }
});

app.listen(PORT, () => {
  console.log(`Weather service running on port ${PORT}`);
});
