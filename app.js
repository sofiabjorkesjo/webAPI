'use strict';

let express = require('express');
let app = express();
let port = process.env.PORT || 8000;

app.listen(port, function(){
    console.log('listen on port ' + port);
})