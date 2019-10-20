const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, pathUserMe, pathAvatarMe,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUserById);
usersRouter.patch('/me', pathUserMe);
usersRouter.patch('/me/avatar', pathAvatarMe);

module.exports = usersRouter;
