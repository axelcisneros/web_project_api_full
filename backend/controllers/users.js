const User = require('../models/user');

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
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
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
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};