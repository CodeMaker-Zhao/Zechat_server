var express = require('express');
var router = express.Router();
const UserModel = require('../db/db').UserModel;
const jwt = require('jsonwebtoken');
const SECRET = 'firstChatAppForLearning';
const fs = require('fs')

/* GET home page. */
router.get('/', function (req, res, next) {
  const raw = String(req.headers.authorization).split(' ').pop();
  try {
    const { id } = jwt.verify(raw, SECRET);
    UserModel.findOne({ _id: id }, (err, user) => {
      console.log('find');
      res.send({
        username: user.username,
        id: user._id,
        friendList: user.friendList
      });
    });
  } catch (error) {
    res.send({
      code: 1,
      msg: 'token错误'
    });
  }
});

router.post('/register', function (req, res, next) {
  const { username, password } = req.body;
  UserModel.findOne({ username }, (err, user) => {
    if (user == null) {
      new UserModel({ username, password }).save(function (err, user) {
        const token = jwt.sign({
          id: String(user._id)
        }, SECRET,
          {
            expiresIn: 60 * 60 * 24 // 授权时效24小时
          });
        res.send({ code: 0, data: { id: user._id, username }, token });
      });
    } else {
      res.send({ code: 1, msg: "用户已经被注册" });
    }
  })
})

router.get('/fileImg', function (req, res) {
  const name = req.query.name;
  const data = fs.readFileSync('public/images/' + name);
  res.send(data);
})

router.get('/bg',function (req,res) {
  const data = fs.readFileSync('public/bg.jpg');
  res.send(data);
})


router.get('/file', function (req, res) {
  const name = req.query.name;
  console.log(name);
  const data = fs.readFileSync('public/file/' + name);
  if (data) {
    res.send(data);
  } else {
    res.send('Something was Wrong');
  }
})

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  UserModel.findOne({ username }, (err, user) => {
    if (user == null) {
      return res.status(422).send({ code: 1, msg: "用户名或密码不正确" });
    }
    const isPasswordValid = require('bcrypt').compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(422).send({ code: 1, msg: "用户名或密码不正确" });
    }
    const token = jwt.sign({
      id: String(user._id)
    }, SECRET,
      {
        expiresIn: 60 * 60 * 24 // 授权时效24小时
      });
    res.send({ code: 0, data: { id: user._id, username, friendList: user.friendList }, token });
  })
})

module.exports = router;
