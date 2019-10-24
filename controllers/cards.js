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
  Card.findById(req.params.id)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new Error('Нельзя удалять чужую карточку!');
      }
    })
    .then(() => Card.findByIdAndRemove(req.params.id))
    .then((card1) => res.send(card1))
    .catch((err) => res.status(500).send(err));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(err));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(err));
};
