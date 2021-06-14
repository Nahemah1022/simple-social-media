var express = require('express');
var router = express.Router();
var UserModel = require('../models/user_model.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user', { pagetitle: 'Profile' });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { pagetitle: 'Sign Up' });
});

router.get('/profile', async function (req, res, next) {
  let profile = await UserModel.getProfile(req.query.account, req.query.password);
  res.render('user', {
    pagetitle: `${profile.nickname}'s Profile`,
    u_id: profile.u_id,
    nickname: profile.nickname,
    post_cnt: profile.post_cnt,
    cmt_cnt: profile.cmt_cnt,
    max_cmt: profile.max_cmt,
    min_cmt: profile.min_cmt,
  });
});

router.post('/register', async function (req, res, next) {
  await UserModel.createUser(req.body.account, req.body.password, req.body.nickname);
  res.redirect(`/user/profile?account=${req.body.account}&password=${req.body.password}`);
});

router.post('/update', async function (req, res, next) {
  for (key in req.body) {
    let me = parseInt(key.split('_').pop());
    let newNickname = req.body[key];
    await UserModel.updateUser(me, newNickname);
  }
  res.redirect(`/user`);
});

module.exports = router;
