const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, postUser, pathUserMe, pathAvatarMe,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.post('/', postUser);
usersRouter.get('/:id', getUserById);
usersRouter.patch('/me', pathUserMe);
usersRouter.patch('/me/avatar', pathAvatarMe);

module.exports = usersRouter;
