var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.isAuthenticated())
  		res.render('index', { title: 'Express' , user : req.user.username});
  	else
  		res.end("Login first");
});

module.exports = router;
