const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./auth-model.js');
const secrets = require('../database/secrets.js');
const auth = require('./authenticate-middleware.js');

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username
  };

  const options = {
    expiresIn: '2h'
  };

  const token = jwt.sign(payload, secrets.jwtSecret, options);
  //console.log(token);
  return token;
}

router.post('/register', (req, res) => {
  // implement registration
  const newUser = req.body;

  if (newUser.username && newUser.password) {
    const hash = bcrypt.hashSync(newUser.password, 12);
    newUser.password = hash;

    User.addUser(newUser)
      .then(added => {
        let aToken = generateToken(added);
        res.status(201).json({ message: 'user added', token: aToken });
      })
      .catch(err => {
        res.status(500).json({ message: 'user could not be added' });
      });
  } else {
    res.status(400).json({ message: 'please enter a username and password' });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    User.findUser({ username })
      .first()
      .then(found => {
        if (found && bcrypt.compareSync(password, found.password)) {
          let aToken = generateToken(found);
          res
            .status(200)
            .json({ message: `welcome ${found.username}`, token: aToken });
        } else {
          res
            .status(401)
            .json({ message: 'user doesnt exist or invalid credentials' });
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'users could not be loaded' });
      });
  } else {
    res.status(400).json({ message: 'please provide all credentials' });
  }
});

router.get('/users', auth, (req, res) => {
  User.getUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: 'users could not be loaded' });
    });
});

module.exports = router;
