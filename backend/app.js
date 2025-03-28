const express = require('express');
const path = require('path');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const cors = require('cors');
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

app.use(cors());
app.options('*', cors());

const errorHandler = (req, res, next) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
};

// Middleware para rutas no encontradas
app.use(errorHandler);

app.use(express.static(path.join(__dirname, 'public')));


app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

app.post('/login' , login);
app.post('/signup', createUser);

app.use(errors());

app.use('/', auth, routesUsers);
app.use('/', auth, routesCards);

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  next();
});

app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
  });

  res.status(err.status || 500).send({ message: 'Internal Server Error' });
});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}...`);
});
