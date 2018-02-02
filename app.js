'use strict';

let express = require('express');
let mongoose = require('mongoose');
let app = express();
let port = process.env.PORT || 8000;

app.use('/', require('./routes/main'));



app.listen(port, function(){
    console.log('listen on port ' + port);
});