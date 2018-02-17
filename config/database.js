 'use strict';

let mongoose = require('mongoose');

module.exports = function () {
    let link = 'mongodb://sofiasuser:sofia@ds145380.mlab.com:45380/sofiasdatabas';
    let db = mongoose.connect(link);
    return db;
};