var express = require('express');
var router = express.Router();
var FriendModel = require('../models/friend_model.js');
var UserModel = require('../models/user_model.js');

/* GET posts listing. */
router.get('/', async function (req, res, next) {
    data = { pagetitle: 'Friend List', friends: [], me: -1, msgs: [], target: -1 };
    res.render('friend', data);
});

router.post('/list', async function (req, res, next) {
    let friends = await FriendModel.getFriends(req.body.account, req.body.password);
    let me = await UserModel.getProfile(req.body.account, req.body.password);
    data = { pagetitle: 'Friend List', friends, me, msgs: [], target: -1 };
    res.render('friend', data);
});

router.post('/add', async function (req, res, next) {
    let result = await FriendModel.addFriend(req.body.account, req.body.password, req.body.target);
    res.redirect('/friend');
});

router.get('/chatroom', async (req, res, next) => {
    let me = {}, msgs, target;
    for (let key in req.query) {
        me.u_id = parseInt(req.query[key]);
        target = parseInt(key.split('_').pop());
        msgs = await FriendModel.getRecentMessages(me.u_id, target);
    }
    data = { pagetitle: 'Friend List', friends: [], me, msgs, target };
    res.render('friend', data);
});

router.post('/send', async (req, res, next) => {
    let message, target, me, msgs;
    for (let key in req.body) {
        message = req.body[key];
        target = parseInt(key.split('_').pop());
        me = parseInt(key.split('_')[0]);
    }
    await FriendModel.newMessage(me, target, message);
    res.redirect(`/friend/chatroom?friend_${target}=${me}`);
});

router.post('/block', async (req, res, next) => {
    let target, me = {};
    for (let key in req.body) {
        me.u_id = parseInt(req.body[key]);
        target = parseInt(key.split('_').pop());
        await FriendModel.addBlacklist(me.u_id, target);
    }
    res.redirect(`/friend`);
});


module.exports = router;