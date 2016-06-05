var cool = require('cool-ascii-faces');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var pg = require('pg');
var flash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');

require('./config/passport.js');

var connectionString = process.env.DATABASE_URL2;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Authenticator
//app.use(express.basicAuth('john', 'doe');

app.use(flash());


//process.env.SESSION_SECRET || 'latwo'
app.use(expressSession({
	secret: 'latwo studios',
	resave: false,
	saveUninitialized: false
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


//main page
app.get('/', function(request, response) {
  response.render('index.jade',
  {
	isAuthenticated: false,
	user: request.user
	//userType: null
  });
});

//login page
app.get('/login', function(req, res) {
	res.render('log/login');
});

app.post('/login', passport.authenticate('local',{	successRedirect: '/',
												   failureRedirect: '/login',
												   failureFlash: true })
);

//logout page
app.get('/logout', function(req, res) {
	req.logout(); 
	res.redirect('/');
});

//register page
app.get('/register', function(req, res) {
	res.render('register');
});

app.get('/admin/paperlist', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ console.error(err); response.send("Can't connect to a database" + err); return;}
    client.query('SELECT * FROM papers', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('admin/admin_paperlist', {paperList: result.rows} ); }
    });
  });
});

app.get('/admin/menu', function(req, res) {
	res.render('admin/menuAdmin');
});

app.get('/editconference', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ console.error(err); response.send("Can't connect to a database" + err); return;}
    client.query('SELECT * FROM conferences', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('conferenceEdition', {conferenceList: result.rows} ); }
    });
  });
});

app.get('/estimatepaper', function(req, res) {
	res.render('estimatePaper');
});

app.get('/participant/menu', function(req, res) {
	res.render('menuParticipant');
});

app.get('/pay', function(req, res) {
	res.render('pay');
});

app.get('/przeglad', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ console.error(err); response.send("Can't connect to a database" + err); return;}
    client.query('SELECT * FROM conferences', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('przeglad', {conferenceList: result.rows} ); }
    });
  });
});

app.get('/reviewer/register', function(req, res) {
	res.render('register_reviewer');
});

app.get('/paper/register', function(req, res) {
	res.render('registerPaper');
});

//because db is written in ejs, we have to change the view engine temporarily
app.set('view engine', 'ejs');
app.get('/db', function (request, response) {
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ console.error(err); response.send("Can't connect to a database" + err); return;}
    client.query('SELECT * FROM users', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('db.ejs', {results: result.rows} ); }
    });
  });
});
app.set('view engine', 'jade');

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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
