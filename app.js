'use strict';

let express = require('express');
let database = require('./config/database');
let bodyParser = require('body-parser');
let passport = require('passport');
let User = require('./model/user');
let strategy = require('passport-github').Strategy;
let findOrCreate = require('mongoose-find-or-create');
let env = require('env2')('.env');


let port = process.env.PORT || 8000;

database();



passport.use(new strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return cb(err, user);
    });
  }

 ));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

let app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', require('./routes/main'));

app.listen(port, function(){
    console.log('listen on port ' + port);
});