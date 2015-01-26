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
var isAuth=function (req,res,next){
	if(req.isAuthenticated())
		next();
	else
		{req.flash('login','LOGIN');res.redirect('/login')}
}
var isValidPassword =function(user,password){
	return user.password==password;
}
function checkAlpha(str)
{
    return str.match(/^([a-zA-Z0-9\_\-]+)$/i);
}
passport.use('login',new LocalStrategy({
	passReqToCallback : true
	},
	function(req,username,password,done){
		if(!checkAlpha(username)){
			return done(null,false,{message:"Username can contain only alphabets,numbers, _ or -"});
		}
		pool.getConnection(function (err,connection){
	        connection.query('SELECT * from users.user where username=\"'+username+'\"', function(err, rows, fields) {
	            if(err)
	            	return done(err);
	            if(!rows[0]){
	            	console.log('no username exists\n');
	            	return done(null,false,{message:'No such user exists'});
	            }
	            var user=rows[0];
	            if(!isValidPassword(user,password)){
	            	console.log('wrong password');
	            	return done(null,false,{message:'Wrong Password'});
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
		if(!checkAlpha(username)){
			return done(null,false,{message:"Username can contain only alphabets,numbers, _ or -"});
		}
		pool.getConnection(function (err,connection){
	        connection.query('SELECT * from users.user where username=\"'+username+'\"', function(err, rows, fields) {
	            if(err)
	            	return done(err);
	            if(rows[0]){
	            	console.log('Username already exists');
	            	return done(null,false,{message:'Username already exists'});
	            }
	            if(!password || password.length==0){
	            	console.log('Empty Password');
	            	return done(null,false,{message:'Choose a password'});
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
passport.use('update',new LocalStrategy({
	passReqToCallback : true
	},
	function(req,oldpassword,newpassword){
		pool.getConnection(function (err,connection){
			connection.query('SELECT * from users.user where username=\"'+req.user.username+'\"',function(err,rows,fields){
				if(err)
	            	return done(err);
	            if(!rows[0]){
	            	console.log('no username exists\n');
	            	return done(null,false,{message:'no  user'});
	            }
	            var user=rows[0];
	            if(user.password!=oldpassword){
	            	console.log('wrong password\n');
	            	return done(null,false,{message:'wrong password'});
	            }
	            connection.query('UPDATE user SET password=/"'+newpassword+'/" where id='+user.id+';',function(err,rows,fields){
	            	if(!err){
	            		return done(null,user);
	            		console.log('changed pwd');
	            	}
	            });
			})
			connection.release();
		});
}))
router.get('/',function (req,res){
	if(req.flash('login')=='LOGIN'){
		req.flash('login','LOGGED');
		res.render('login',{title:'Login',errormess:'Login to access site'});
	}
	else
		res.render('login',{title:'Login'});
})
router.get('/register',function (req,res){
	res.render('register')
})
router.get('/logout',isAuth,function (req,res){
	if(req.isAuthenticated()){
		req.logout();
	}
	res.redirect('/login');
})

router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('login',{errormess:info.message}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log('logging in '+user.username);
      return res.redirect('/');
    });
  })(req, res, next);
});
router.post('/register', function(req, res, next) {
  passport.authenticate('register', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('register',{errormess:info.message}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log('logging in '+user.username);
      return res.redirect('/');
    });
  })(req, res, next);
});
router.post('/update',isAuth,function (req,res){
	pool.getConnection(function (err,connection){
		if(req.body.newpassword){
			if(req.body.oldpassword!=req.user.password)
			connection.query('UPDATE user SET password=/"'+req.body.newpassword+'/" where id='+req.user.id+';',function(err,rows,fields){
	        	if(!err){
	        		return done(null,user);
	        		console.log('changed pwd');
	        	}
	        });
		}
	});
})
module.exports=router;