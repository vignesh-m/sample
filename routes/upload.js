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
		{req.flash('login','LOGIN');res.redirect('/login')}
}
router.get('/',isAuth,function (req,res){
	res.render('upload',{title:'Upload'});
})
router.post('/upload',isAuth,function (req,res){
	var files=req.files.upload;
	if(!files){
		res.redirect('/upload');
	}
	else {
	// console.log(files);
	if(!files.length && files.fieldname=='upload'){
		pool.getConnection(function (err,connection){
		if(req.user && req.user.id && files && files.name){
			// console.log(files);
			connection.query('INSERT INTO users.uploads (userid,filename,orgfilename) values ('+req.user.id+',\''+files.name+'\',\''+files.originalname+'\');',function (err,row,fields){
				if(!err){
					console.log('added');console.log(files.name);		
					res.redirect('/upload/list');
				}
			})} else {
				console.log('error with db')
			}
			connection.release();
			
		});
	}
	else {
	files.forEach(function(file,index,array){
	// console.log(file);
	pool.getConnection(function (err,connection){
		if(req.user && req.user.id && file && file.name){
			connection.query('INSERT INTO users.uploads (userid,filename,orgfilename) values ('+req.user.id+',\''+file.name+'\',\''+file.originalname+'\');',function (err,row,fields){
				if(!err){
					console.log('added');console.log(file.name);
					if(index==array.length-1)	
						res.redirect('/upload/list');
				}
			})
		} else {
			console.log('error with db');
			// console.log(req.user.id +' '+ JSON.stringify(file));
		}
		connection.release();
			
		});
	});
	}
	}
})
router.get('/list',isAuth,function (req,res){
	pool.getConnection(function (err,connection){
		if(req.user && req.user.id)
		connection.query('SELECT * from users.uploads where userid='+req.user.id+';',function (err,row,fields){
			if(!err){
				// console.log(row);
				res.render('filelist',{title:'Uploads',list:row,user:req.user});
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
				console.log(row);
				if(!row || row.length<=0 || !row[0] || !row[0].userid) res.end("File doesnt exist");
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