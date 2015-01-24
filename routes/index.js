var express = require('express');
var router = express.Router();

var isAuth=function (req,res,next){
	if(req.isAuthenticated())
		next();
	else
		res.end('Login first');
}

router.get('/', isAuth,function(req, res, next) {
	res.render('index', { title: 'Express' , user : req.user.username});
});

module.exports = router;
