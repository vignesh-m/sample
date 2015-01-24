var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  	if(req.isAuthenticated())
  		res.render('user',{user:req.user});
  	else
  		res.end('Login first');
});

module.exports = router;
