var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var pool=mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : ''
})

router.get('/',function (req,res){
	if(req.isAuthenticated())
		res.render('upload');
	else
		res.end('Login first');
})
router.post('/upload',function (req,res){

	res.end('got file '+JSON.stringify(req.files));
	pool.getConnection(function (err,connection){
		if(req.user.id && req.files.uploadfile.name)
		connection.query('INSERT INTO users.uploads (userid,filename) values ('+req.user.id+',\''+req.files.uploadfile.name+'\');',function (err,row,fields){
			if(!err){
				;		
			}
		})
	});
	console.log(req.user.id);
	console.log(req.files.uploadfile.name);
})

module.exports=router;