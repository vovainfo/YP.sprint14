const cardsRouter = require('express').Router();
const {
  getAllCards, postCard, delCard, likeCard, dislikeCard,
} = require('../controllers/cards');


cardsRouter.get('/', getAllCards);
cardsRouter.post('/', postCard);
cardsRouter.delete('/:id', delCard);
cardsRouter.put('/:id/likes', likeCard);
cardsRouter.delete('/:id/likes', dislikeCard);

module.exports = cardsRouter;
