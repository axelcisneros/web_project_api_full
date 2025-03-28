const express = require('express');
const path = require('path');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const mongoose = require('mongoose');
const cors = require('cors');
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());

app.post('/login' , login);
app.post('/signup', createUser);

app.use('/', auth, routesUsers);
app.use('/', auth, routesCards);
// Middleware para rutas no encontradas
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}...`);
});
