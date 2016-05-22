var passport = require('passport');
var passportLocal = require('passport-local');
var express = require('express');
var app = express();

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	//query db or cache here
	done(null, {id: id, name: id});
});

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
	console.log(username + ' ' + password);
	if(username == password)
		done(null, passport.user);
	else
		done(null, false, {message: 'Something wrong. Please don\'t hate me.'});
}));