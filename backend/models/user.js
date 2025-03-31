const mongoose = require('mongoose');
const validator = require('validator');

const requiredMessage = 'El campo {PATH} es obligatorio.';
const minlengthMessage = 'El campo {PATH} debe tener al menos {MINLENGTH} caracteres.';
const maxlengthMessage = 'El campo {PATH} debe tener como máximo {MAXLENGTH} caracteres.';
const urlMessage = 'El campo {PATH} debe ser una URL válida.';
const emailMessage = 'El campo {PATH} debe ser un email válido.';

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      minlength: [2, minlengthMessage],
      maxlength: [30, maxlengthMessage],
      default: 'Jacques Cousteau' // Valor predeterminado
  },
  about: {
      type: String,
      minlength: [2, minlengthMessage],
      maxlength: [30, maxlengthMessage],
      default: 'Explorador' // Valor predeterminado
  },
  avatar: {
      type: String,
      validate: {
          validator: (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
          message: urlMessage
      },
      default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg' // Enlace predeterminado
  },
  email: {
      type: String,
      required: [true, requiredMessage],
      unique: true,
      validate: {
          validator: (v) => validator.isEmail(v),
          message: emailMessage
      }
  },
  password: {
      type: String,
      required: true,
      select: false // No incluir por defecto en las consultas
  }
});

module.exports = mongoose.model('user', userSchema);