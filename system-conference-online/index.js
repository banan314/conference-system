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


var passport = require('passport');
var passportLocal = require('passport-local');
var expressSession = require('express-session');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Authenticator
//app.use(express.basicAuth('john', 'doe');

app.use(passport.initialize());
app.use(passport.session());

var connectionString = process.env.DATABASE_URL2;
passport.use(new passportLocal.Strategy(function(username, password, done) {
	/* pg.connect(connectionString, function(err, client, done) {
		if(err)
		{ console.error(err); response.send("Can't connect to a database" + err); return;}
		var userCredentials;
		client.query('SELECT * FROM users WHERE ', function(err, result) {
		done();
		if (err)
		{ console.error(err); response.send("Error " + err); }
		else { 
			userCredentials = result;
		}
		});
	}); */
	//if(userCredentials == '') //or null, what is returned by SELECT?
	if(username == password)
		done(null, {id: 100, first_name: Janush, last_name: Kovalsky});
	else
		done(null, null);
}));

//process.env.SESSION_SECRET || 'latwo'
app.use(expressSession({
	secret: 'latwo studios',
	resave: false,
	saveUninitialized: false
}));

app.get('/', function(request, response) {
  response.render('index', {
	isAuthenticated: false,
	user: req.user,
	userType: null
  });
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
