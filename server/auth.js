const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Leer el token del encabezado Authorization
  const token = req.header('Authorization').replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).send('Acceso denegado. No se proporcionó un token.');
  }

  try {
    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifica el token con la secret key
    req.user = decoded;  // Guardar los datos decodificados en req.user para su uso posterior
    next();  // Pasar al siguiente middleware
  } catch (error) {
    res.status(400).send('Token no válido.');
  }
};

module.exports = auth;
