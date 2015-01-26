var express = require('express');
var router = express.Router();

/* GET users listing. */
var isAuth=function (req,res,next){
	if(req.isAuthenticated())
		next();
	else
		{req.flash('login','LOGIN');res.redirect('/login')}
}
router.get('/', isAuth,function(req, res, next) {
	res.render('user',{user:req.user});
});
router.get('/edit',isAuth,function (req,res){
	res.render('useredit',{user:req.user});
})
module.exports = router;
