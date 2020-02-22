const db = require('../database/dbConfig.js');

module.exports = {
  addUser,
  findUser,
  getUsers
};

function addUser(user) {
  return db('users').insert(user);
}

function findUser(username) {
  return db('users').where(username);
}

function getUsers() {
  return db('users');
}
