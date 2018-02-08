'use strict';

let express = require('express');
let database = require('./config/database');
let bodyParser = require('body-parser');
let app = express();
let port = process.env.PORT || 8000;

database();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', require('./routes/main'));

app.listen(port, function(){
    console.log('listen on port ' + port);
});