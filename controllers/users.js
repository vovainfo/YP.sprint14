const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error500 = require('../errors/error500');
const NotAuthorized = require('../errors/not-authorized');
const { DEV_SECRET_KEY } = require('./../config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getAllUsers = (req, res, next) => {
  User.find({}, '-password')
    .then((users) => res.send(users))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id, '-password')
    .then((user) => res.send(user))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userNoPassword = user.toObject();
      delete userNoPassword.password;
      res.send(userNoPassword);
    })
    .catch((err) => next(new Error500(err.message)));
};

module.exports.pathUserMe = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { select: '-password' })
    .then((user) => { res.send(user); })
    .catch((err) => next(new Error500(err.message)));
};

module.exports.pathAvatarMe = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { select: '-password' })
    .then((user) => res.send(user))
    .catch((err) => next(new Error500(err.message)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET_KEY, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => next(new NotAuthorized(err.message)));
};
