var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var pool=mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : ''
})
/*
router.all('*',function (req,res,next){
	if(req.isAuthenticated())
		next();
	else
		res.end('Login first');
		//next(new Error(401));
})
*/
var isAuth=function (req,res,next){
	if(req.isAuthenticated())
		next();
	else
		res.end('Login first');
}
router.get('/',isAuth,function (req,res){
	res.render('upload');
})
router.post('/upload',isAuth,function (req,res){
	res.redirect('/upload/list');
	pool.getConnection(function (err,connection){
		if(req.user.id && req.files.uploadfile.name)
		connection.query('INSERT INTO users.uploads (userid,filename,orgfilename) values ('+req.user.id+',\''+req.files.uploadfile.name+'\',\''+req.files.uploadfile.originalname+'\');',function (err,row,fields){
			if(!err){
				;		
			}
		})
	});
})
router.get('/list',isAuth,function (req,res){
	pool.getConnection(function (err,connection){
		if(req.user && req.user.id)
		connection.query('SELECT orgfilename from users.uploads where userid='+req.user.id+';',function (err,row,fields){
			if(!err){
				res.render('filelist',{list:row,user:req.user});
			}
		})
	});
})
module.exports=router;