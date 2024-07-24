const uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);
  if (authHeader && authHeader === `Bearer ${uniqueIdentifier}`) {
    next();
    console.log('Valid Token');
  } else {
    console.log('Forbidden - Invalid Token');
    res.status(403).send('Forbidden');
  }
};

module.exports = authMiddleware;
