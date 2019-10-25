const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({}, '-password')
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(err));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id, '-password')
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err));
};

module.exports.createUser = (req, res) => {
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
    .catch((err) => res.status(500).send(err));
};

module.exports.pathUserMe = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { select: '-password' })
    .then((user) => { res.send(user); })
    .catch((err) => res.status(500).send(err));
};

module.exports.pathAvatarMe = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { select: '-password' })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};
