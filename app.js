'use strict';

let express = require('express');
let path = require('path');
let database = require('./config/database');
let session = require('express-session');
let bodyParser = require('body-parser');
let passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
let User = require('./model/user');
let strategy = require('passport-github').Strategy;
let findOrCreate = require('mongoose-find-or-create');
let config = require('./config/config')
let env = require('env2')('.env');
let events = require('events');
let eventEmitter = new events.EventEmitter();

let port = process.env.PORT || 8000;

database();


// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ));


//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });
  
//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function (err, user) {
//       done(err, user);
//     });
//   });

// passport.use(new strategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: 'http://localhost:8000/auth/github/callback'
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ githubId: profile.id }, function (err, user) {
//         return cb(err, user);
//     });
//   }
//  ));

// passport.serializeUser(function(user, cb) {
//     cb(null, user);
//   });

// passport.deserializeUser(function(id, cb) {
//     User.findById(id, function(err, user) {
//         console.log('test');
//         cb(err, user)
//     })
// });

let app = module.exports = express();

app.set('superSecret', config.secret)

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', require('./routes/main'));

app.listen(port, function(){
    console.log('listen on port ' + port);
});

