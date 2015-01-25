var express = require('express');
var router = express.Router();
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
		res.end('Login first');
}
router.get('/',isAuth,function (req,res){
	res.render('upload',{title:'Upload'});
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
		connection.query('SELECT * from users.uploads where userid='+req.user.id+';',function (err,row,fields){
			if(!err){
				res.render('filelist',{list:row,user:req.user});
			}
		})
	});
})
router.get('/get',isAuth,function (req,res){
	var name=req.query.filename;
	console.log(name);
	if(!name){
		res.end("File doesnt exist");
	}
	pool.getConnection(function (err,connection){
		if(req.user && req.user.id)
		connection.query('SELECT * from users.uploads where filename=\''+name+'\';',function (err,row,fields){
			if(!err){
				if(row.length<=0 || !row[0] || !row[0].userid) res.end("File doesnt exist");
				else if(row[0].userid!=req.user.id)
					res.end("You are not authorized to view this file");
				else {
					console.log('./uploads/'+name)
					res.download('./uploads/'+name,function (err){
						if(err) console.log(err);
						//res.redirect('/upload/list');
					});
				}
			}
		})
	});
})
module.exports=router;