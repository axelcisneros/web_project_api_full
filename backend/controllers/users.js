const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err); // Propaga el error al middleware de manejo de errores
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    });
    res.status(200).send(user);
  } catch (err) {
    next(err); // Propaga el error al middleware de manejo de errores
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).send(userWithoutPassword);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.statusCode = 400;
    } else if (err.code === 11000) {
      err.statusCode = 409;
      err.message = 'El email ya está en uso';
    }
    next(err); // Propaga el error al middleware de manejo de errores
  }
};

const updateUser = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    ).orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    });
    res.send(user);
  } catch (err) {
    next(err); // Propaga el error al middleware de manejo de errores
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    ).orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    });
    res.send(user);
  } catch (err) {
    next(err); // Propaga el error al middleware de manejo de errores
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Correo electrónico o contraseña incorrectos');
      error.statusCode = 401;
      throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error('Correo electrónico o contraseña incorrectos');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.send({ token });
  } catch (err) {
    next(err); // Propaga el error al middleware de manejo de errores
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};