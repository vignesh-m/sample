var express = require('express');
var router = express.Router();
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var mysql=require('mysql');
var pool=mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : ''
})

var isValidPassword =function(user,password){
	return user.password==password;
}
passport.use('login',new LocalStrategy({
	passReqToCallback : true
	},
	function(req,username,password,done){
		pool.getConnection(function (err,connection){
	        connection.query('SELECT * from users.user where username=\"'+username+'\"', function(err, rows, fields) {
	            if(err)
	            	return done(err);
	            if(!rows[0]){
	            	console.log('no username exists\n');
	            	return done(null,false,{message:'no  user'});
	            }
	            var user=rows[0];
	            if(!isValidPassword(user,password)){
	            	console.log('wrong password');
	            	return done(null,false,{message:'wrong pwd'});
	            }
	            return done(null,user);
	        });
	        connection.release();
	    });  
	}
));
passport.use('register',new LocalStrategy({
	passReqToCallback : true
	},
	function(req,username,password,done){
		pool.getConnection(function (err,connection){
	        connection.query('SELECT * from users.user where username=\"'+username+'\"', function(err, rows, fields) {
	            if(err)
	            	return done(err);
	            if(rows[0]){
	            	console.log('username already exists\n');
	            	return done(null,false,{message:'no  user'});
	            }
	            var nuser={username:username,password:password,id:-1};
	            connection.query('INSERT INTO users.user(username,password) VALUES (\"'+username+'\",\"'+password+'\");', function(err2, rows2, fields2){
	            	if(err2) return done(err2);
	            	// TODO: better way to get id
	            	nuser.id=rows2.insertId;
	            	return done(null,nuser);
	            });
	        });
	        connection.release();
	    });  
	}
));
router.get('/',function (req,res){
	res.render('login')
})
router.get('/register',function (req,res){
	res.render('register')
})
router.get('/logout',function (req,res){
	if(req.isAuthenticated()){
		req.logout();
	}
	res.redirect('/');
})

router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log('logging in '+user.username);
      return res.redirect('/');
    });
  })(req, res, next);
});
router.post('/register',passport.authenticate('register',{
	successRedirect: '/',
	failureRedirect: '/login/register'
}))
module.exports=router;