const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

// Return http status 429 as 30% range
function rateLimiter(_req, res, next) {
  if (Math.random() < 0.3) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }
  next();
}

const check = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader === `Bearer ${uniqueIdentifier}`) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

app.use(cors({
  origin: 'http://localhost:4200', // İstemci uygulamanızın URL'si
  optionsSuccessStatus: 200, // Tarayıcıların CORS preflight (ön kontrol) istekleri için döndürülecek başarı durum kodu
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilen HTTP yöntemleri
  allowedHeaders: ['Content-Type', 'Authorization'], // İzin verilen başlıklar
  credentials: true // Kimlik doğrulama bilgileri (örneğin, çerezler) gönderilmesine izin verir
}));

app.use(rateLimiter);//İstemcilerin belirli bir süre içinde yapabilecekleri istek sayısını sınırlayarak, hizmetinizin kötüye kullanımını önler
app.use(bodyParser.json());

app.get('/order', check, (_req, res) => {
  const order = [
    { id: 1, name: 'Cool Shirt', price: 25.0, qty: 3, weight: 0.5 },
    { id: 2, name: 'Cool Pants', price: 45.0, qty: 2, weight: 1 },
    { id: 3, name: 'Light Saber', price: 125.0, qty: 1, weight: 5 }
  ];
  res.json(order);
});

app.get('/shipping', check, (_req, res) => {
  const shipping = {
    carrier: 'UPS',
    address: {
      name: 'Amanda Miller',
      phone: '555-555-5555',
      address_line1: '525 S Winchester Blvd',
      city_locality: 'San Jose',
      state_province: 'CA',
      postal_code: '95128',
      country_code: 'US'
    },
    cost: 7.99
  };
  res.json(shipping);
});

app.get('/tax', check, (_req, res) => {
  const tax = { amount: 0.07 };
  res.json(tax);
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
