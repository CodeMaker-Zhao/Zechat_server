var express = require('express');
var router = express.Router();
const UserModel = require('../db/db').UserModel;
const jwt = require('jsonwebtoken');
const SECRET = 'firstChatAppForLearning';

/* GET home page. */
router.get('/', function (req, res, next) {
  const raw = String(req.headers.authorization).split(' ').pop();
  try {
    const { id } = jwt.verify(raw, SECRET);
    UserModel.findOne({_id:id},(err,user)=>{
      if(!user){
        res.send({
          code:1,
          msg:'不存在此用户'
        })
        return;
      }
      console.log('find');
      res.send({
        code:0,
        username:user.username,
        id:user._id,
        friendList:user.friendList
      });
    });
  } catch (error) {
    res.send({
      code:1,
      msg:'token错误'
    });
  }
});

module.exports = router;
