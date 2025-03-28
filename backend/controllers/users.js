const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const handlerError = () => {
  const error = new Error('Usuario no encontrado');
  error.statusCode = 404;
throw error;
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Error del servidor' }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
  .orFail(() => handlerError())
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'error interno del servidor' });
      }
});
};


const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  // Asegurarse de que la contraseña sea hasheada
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      // Crear el usuario con los datos proporcionados
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword, // Guardar la contraseña hasheada
      });
    })
    .then((user) => {
      // Evitar devolver la contraseña en la respuesta
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.code === 11000) { // Error de duplicados (email único)
        res.status(409).send({ message: 'El email ya está en uso' });
      } else {
        res.status(500).send({ message: 'Error del servidor' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body; // Desestructuramos solo lo que se va a actualizar

  User.findByIdAndUpdate(
    req.user._id, // ID del usuario autenticado
    { name, about }, // Solo permitimos actualizar estos campos
    { new: true, runValidators: true } // Opciones de Mongoose
  )
    .orFail(() => handlerError())
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'error interno del servidor' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body; // Solo permitimos actualizar el avatar

  User.findByIdAndUpdate(
    req.user._id, // ID del usuario autenticado
    { avatar }, // Actualizamos solo el avatar
    { new: true, runValidators: true } // Opciones de Mongoose
  )
    .orFail(() => handlerError())
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'error interno del servidor' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario por correo electrónico
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // Usuario no encontrado
        return res.status(401).send({ message: 'Correo electrónico o contraseña incorrectos' });
      }

      // Comparar la contraseña proporcionada con la almacenada
      bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            // Contraseña incorrecta
            return res.status(401).send({ message: 'Correo electrónico o contraseña incorrectos' });
          }

          // Crear el token JWT
          const token = jwt.sign(
            { _id: user._id }, // Payload del token
            process.env.JWT_SECRET,  // Clave secreta para firmar el token
            { expiresIn: '7d' } // Duración del token: 7 días
          );

          // Enviar el token al cliente
          res.send({ token });
        });
    })
    .catch(() => {
      res.status(500).send({ message: 'Error del servidor' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};