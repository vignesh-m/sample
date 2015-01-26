var express = require('express');
var router = express.Router();

var isAuth=function (req,res,next){
	if(req.isAuthenticated())
		next();
	else
		{req.flash('login','LOGIN');res.redirect('/login')}
}

router.get('/', isAuth,function(req, res, next) {
	res.render('index', { title: 'Hello ' , user : req.user});
});

module.exports = router;
