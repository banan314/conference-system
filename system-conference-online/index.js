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


app.use(flash());


//process.env.SESSION_SECRET || 'latwo'
app.use(expressSession({
	secret: 'latwo studios',
	resave: false,
	saveUninitialized: false
}));

var passport = require('passport');
var passportLocal = require('passport-local');

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	//done(null, user.id);
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	//query db or cache here
	//done(null, {id: id, name: id});
	done(null, user);
});

passport.use(new passportLocal.Strategy(function(username, password, done) {
	console.log('hello, im in passport');
	 pg.connect(connectionString, function(err, client, done) {
		if(err)
		{ console.error(err); response.send("Can't connect to a database" + err); return;}
		var userCredentials;
		client.query('SELECT * FROM users WHERE first_name= ($1) AND password_enc=($2) ',
		[uername, password],
		function(err, result) {
		done();
		if (err)
		{ console.error(err); response.send("Error " + err); }
		else { 
			if(result.rows.length > 0) {
				console.log('Correct! pass: ' + password + ' user: ' + username);
				done(null, result.rows[0]);
			}
			else {
				console.log('Incorrect! pass: ' + password + ' user: ' + username);
				done(null, false, {message: 'Something wrong. Please don\'t hate me.'});
			}
		}
		});
	}); 
	//if(userCredentials == '') //or null, what is returned by SELECT?
	if(username == password)
	{
		console.log('Correct! pass: ' + password + 'user: ' + username);
		done(null, {username: username, password: password});
		//{id: username, name: username});
	}
	else
	{
		console.log(password);
		done(null, false, {message: 'Something wrong. Please don\'t hate me.'});
	}
}));

var connectionString = process.env.DATABASE_URL2;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Authenticator
//app.use(express.basicAuth('john', 'doe');


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

//------------------------------------------
// login, register and logout
//------------------------------------------
//login page
app.get('/login', function(req, res) {
	res.render('log/login');
});

app.post('/login', passport.authenticate('local'),function(req,res) {
	res.redirect('/');
}/* {	successRedirect: '/',
												   failureRedirect: '/login',
												   failureFlash: true }) */
);

//logout page
app.get('/logout', function(req, res) {
	req.logout(); 
	res.redirect('/');
});

//register page
app.get('/register', function(req, res) {
	res.render('log/register');
});
//------------------------------------------

app.get('/admin/paperlist', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ console.error(err); res.send("Can't connect to a database" + err); return;}
    client.query('SELECT * FROM papers', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.render('admin/admin_paperList', {paperList: result.rows} ); }
    });
  });
});

app.get('/admin/menu', function(req, res) {
	res.render('admin/menuAdmin');
});

app.get('/editconference', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ console.error(err); res.send("Can't connect to a database" + err); return;}
    client.query('SELECT * FROM conferences', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.render('conferenceEdition', {conferenceList: result.rows} ); }
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
	{ console.error(err); res.send("Can't connect to a database" + err); return;}
    client.query('SELECT * FROM conferences', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.render('przeglad', {conferenceList: result.rows} ); }
    });
  });
});

app.get('/reviewer/register', function(req, res) {
	res.render('register_reviewer');
});

app.get('/paper/register', function(req, res) {
	res.render('registerPaper');
});

//POST requests for register paper, register reviewer, estimatePaper
//------------------------------------------
//add paper to the database
app.post('/paper/register', function(req, res) {
/* 	console.log('POST service ' + req.body.paperTopic);
	res.redirect('back'); */
	var randomID = Math.floor((Math.random() * 10000) + 21);
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ 
	  console.error(err); res.send("Can't connect to a database" + err); return;}
	  //client.query('INSERT INTO papers (topic, introduction, main_content,user_id) VALUES ($1,$2,$3,10)',
	  client.query('INSERT INTO papers (topic, introdution, main_content,user_id, id) VALUES ($1,$2,$3,10,$4)',
	  [req.body.paperTopic, req.body.paperIntro, req.body.paperMainContent,randomID],
	  function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.redirect('back'); }
    });
  });
});

//add reviewer to the database
app.post('/reviewer/register', function(req, res) {
	var randomID = Math.floor((Math.random() * 10000) + 21);
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ 
	  console.error(err); res.send("Can't connect to a database" + err); return;}
	  client.query('INSERT INTO reviewers (knowledge_fields, user_id, id) VALUES ($1,10,$2)',
	  [req.body.experience,randomID],
	  function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.redirect('back'); }
    });
  });
});

//add a review to the database
app.post('/estimatepaper', function(req, res) {
	var randomID = Math.floor((Math.random() * 10000) + 21);
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ 
	  console.error(err); res.send("Can't connect to a database" + err); return;}
	  client.query('INSERT INTO reviews (opinion, comment_admin, topic_rate, content_rate, decision, reviewer_id, application_id) VALUES ($1,$2,$3,$4,$5, $6, $7)',
	  [req.body.estimation, req.body.comment, req.body.subjectMatch, req.body.merValue, req.body.verdict, req.body.user_id, req.body.reviewer_id],
	  function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.redirect('back'); }
    });
  });
});

//add a new user to the database
app.post('/register', function(req, res) {
	var randomID = Math.floor((Math.random() * 10000) + 21);
  pg.connect(connectionString, function(err, client, done) {
	if(err)
	{ 
	  console.error(err); res.send("Can't connect to a database" + err); return;}
	  client.query('INSERT INTO users (first_name, last_name, email, password_enc, id) VALUES ($1,$2,$3,$4,$5)',
	  [req.body.username, req.body.username, req.body.email, req.body.password, randomID],
	  function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.redirect('/'); }
    });
  });
}); 
//------------------------------------------

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
