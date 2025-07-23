require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./utils/logger');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');

const { PORT = 3000 } = process.env;
const app = express();

// ----- CORS CONFIG -----
const allowedOrigins = [
  "https://around.kje.us",
  "http://localhost:3000",
  "https://api.around.kje.us"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "CORS policy: Origin not allowed.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ----- LOGGERS Y MIDDLEWARE -----
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));

// ----- DB -----
mongoose.connect('mongodb://127.0.0.1:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ----- RUTAS -----
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

app.post('/login', login);
app.post('/signup', createUser);

app.use('/', auth, routesUsers);
app.use('/', auth, routesCards);

// ----- ERRORES -----
app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => {
  const error = new Error('Recurso solicitado no encontrado');
  error.statusCode = 404;
  next(error);
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message: statusCode === 500 ? 'Error interno del servidor' : message,
  });
});

// ----- INICIAR SERVER -----
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
