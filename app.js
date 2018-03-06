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

