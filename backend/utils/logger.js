const { createLogger, format, transports } = require('winston');
const path = require('path');

// Crear el logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json() // Formato JSON para los logs
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/request.log') }), // Log de solicitudes
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }), // Log de errores
  ],
});

module.exports = logger;
