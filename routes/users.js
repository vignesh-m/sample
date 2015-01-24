var express = require('express');
var router = express.Router();

/* GET users listing. */
var isAuth=function (req,res,next){
	if(req.isAuthenticated())
		next();
	else
		res.end('Login first');
}
router.get('/', isAuth,function(req, res, next) {
	res.render('user',{user:req.user});
});

module.exports = router;
