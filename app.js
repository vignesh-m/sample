var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer=require('multer');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var upload = require('./routes/upload');

var app = express();

//mysql
var mysql=require('mysql');
var pool=mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : ''
})

//passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'S3KR3T_^^-KEESS'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
    pool.getConnection(function (err,connection){
        connection.query('SELECT * from users.user where id='+id, function(err, rows, fields) {
            done(err,rows[0]);
        });
        connection.release();
    });  
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('etag');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(multer({
    dest: './uploads/',
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}))
app.use(flash());
app.use('/', routes);
app.use('/users', users);
app.use('/login',login);
app.use('/upload',upload);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
