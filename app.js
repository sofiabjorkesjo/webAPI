'use strict';

let express = require('express');
let database = require('./config/database');
let app = express();
let port = process.env.PORT || 8000;
let model = require('./model/cakeModel');

database();

app.use('/', require('./routes/main'));

app.listen(port, function(){
    console.log('listen on port ' + port);
});