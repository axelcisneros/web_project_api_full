const express = require('express');
const path = require('path');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./utils/logger');
const mongoose = require('mongoose');
const allowedOrigins = ["https://around.kje.us/"];
let cors = require('cors');
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}

const { errors } = require('celebrate');
require('dotenv').config();
const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Se conecta a la base de datos de mongodb en el puerto 27017 y la base de datos se llama aroundb
mongoose.connect('mongodb://127.0.0.1:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const errorHandler = (req, res, next) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
};

app.use(cors(
  {
    origin: corsOptions,
    credentials: true
  }
));

app.use(requestLogger); // logger de peticiones

app.use(express.static(path.join(__dirname, 'public')));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

app.post('/login' , login);
app.post('/signup', createUser);

app.use('/', auth, routesUsers);
app.use('/', auth, routesCards);

app.use(errorLogger); // logger de errores

app.use(errors); // celebrate errores

// Middleware para rutas no encontradas
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
