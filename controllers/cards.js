const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send(err));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(err));
};

module.exports.delCard = (req, res) => {
//  Card.findByIdAndRemove(req.params.id)
  Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(err));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(err));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(err));
};
