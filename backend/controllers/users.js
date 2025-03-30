const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next); // Propaga el error al middleware de manejo de errores
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error; // Lanza el error para que sea capturado
    })
    .then((user) => res.status(200).send(user))
    .catch(next); // Propaga el error al middleware de manejo de errores
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
      } else if (err.code === 11000) {
        err.statusCode = 409;
        err.message = 'El email ya está en uso';
      }
      next(err); // Propaga el error al middleware de manejo de errores
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch(next); // Propaga el error al middleware de manejo de errores
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch(next); // Propaga el error al middleware de manejo de errores
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error('Correo electrónico o contraseña incorrectos');
        error.statusCode = 401;
        throw error;
      }

      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          const error = new Error('Correo electrónico o contraseña incorrectos');
          error.statusCode = 401;
          throw error;
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.send({ token });
      });
    })
    .catch(next); // Propaga el error al middleware de manejo de errores
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};