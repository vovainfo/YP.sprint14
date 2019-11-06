const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, pathUserMe, pathAvatarMe,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUserById);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), pathUserMe);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), pathAvatarMe);

module.exports = usersRouter;
