const { celebrate, Joi } = require('celebrate');
const cardsRouter = require('express').Router();
const {
  getAllCards, postCard, delCard, likeCard, dislikeCard,
} = require('../controllers/cards');


cardsRouter.get('/', getAllCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), postCard);


cardsRouter.delete('/:id', delCard);
cardsRouter.put('/:id/likes', likeCard);
cardsRouter.delete('/:id/likes', dislikeCard);

module.exports = cardsRouter;
