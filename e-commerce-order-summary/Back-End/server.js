const express = require('express');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(cors());

app.get('/order', (_req, res) => {
  const order = [
    { id: 1, name: 'Cool Shirt', price: 25.0, qty: 3, weight: 0.5 },
    { id: 2, name: 'Cool Pants', price: 45.0, qty: 2, weight: 1 },
    { id: 3, name: 'Light Saber', price: 125.0, qty: 1, weight: 5 }
  ];
  res.json(order);
});

app.get('/shipping', (_req, res) => {
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

app.get('/tax', (_req, res) => {
  const tax = { amount: 0.07 };
  res.json(tax);
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
