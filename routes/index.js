var express = require('express');
var router = express.Router();

var UserModel = require('../models/user_model.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { pagetitle: 'Simple Social Media App', result: [], menu: [] });
});

router.get('/query', async function (req, res, next) {
  let result = await UserModel.query(req.query.query);
  // let result = "";
  res.render('index', {
    pagetitle: 'Simple Social Media App',
    title: 'Query result:',
    result: result,
    menu: Object.keys(result[0])
  });
});

module.exports = router;
