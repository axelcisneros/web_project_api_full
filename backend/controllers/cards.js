const Card = require('../models/card');

const handlerError = () => {
    const error = new Error('Card not found');
    error.statusCode = 404;
    throw error;
};

const getCards = (req, res) => {
    Card.find({})
        .then((cards) => res.send(cards))
        .catch((err) => res.status(500).send({ message: err.message }));
};

const getCard = (req, res) => {
  Card.findById(req.params.id)
      .orFail(() => handlerError())
      .then((card) => {
          res.send(card);
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

const likeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
        .orFail(() => handlerError())
        .then((card) => {
            return res.send(card);
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

const dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
        .orFail(() => handlerError())
        .then((card) => {
            return res.send(card);
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

const createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
      .then((card) => res.send(card))
      .catch((err) => {
          if (err.name === 'ValidationError') {
              res.status(400).send({ message: err.message });
          } else {
              res.status(500).send({ message: 'Error interno del servidor' });
          }
      });
};

const deleteCard = (req, res) => {
    Card.findByIdAndDelete(req.params.id)
        .orFail(() => handlerError())
        .then((card) => {
            return res.send(card);
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
    getCards,
    getCard,
    likeCard,
    createCard,
    deleteCard,
    dislikeCard
};