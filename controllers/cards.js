const Card = require('../models/card');
const Error500 = require('../errors/error500');


module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.delCard = (req, res, next) => {
  Card.findById(req.params.id)
  // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('Нельзя удалять чужую карточку!');
      }
    })
    .then(() => Card.findByIdAndRemove(req.params.id))
    .then((card1) => res.send(card1))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => next(new Error500(err.message)));
};
