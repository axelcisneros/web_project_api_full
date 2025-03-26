const users = require('express').Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar } = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/:id', getUser);
users.post('/users', createUser);
users.patch('/users/me', updateUser);
users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
