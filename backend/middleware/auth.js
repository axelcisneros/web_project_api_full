const jwt = require('jsonwebtoken');

// Middleware de autorización
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Verificar si el encabezado de autorización está presente y en formato correcto
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ message: 'Acceso prohibido: autorización requerida' });
  }

  // Extraer el token después de "Bearer "
  const token = authorization.replace('Bearer ', '');

  try {
    // Verificar el token usando la clave secreta
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar el payload del token al objeto req.user
    req.user = payload;

    // Continuar al siguiente middleware o controlador
    next();
  } catch (err) {
    // Error 401 si el token es inválido o ha expirado
    res.status(401).send({ message: 'Token inválido o expirado' });
  }
};

module.exports = auth;
