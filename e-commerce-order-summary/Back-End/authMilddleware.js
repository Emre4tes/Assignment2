const AUTH_KEY = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';
function checkAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader === AUTH_KEY) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
}

export default checkAuth;
