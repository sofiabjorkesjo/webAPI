'use strict';

let mongoose = require('mongoose');

let cakeSchema = new mongoose.Schema({
    sortOfCake: {type: String, required: true},
    baker: {type: String, required: true},
    aboutBaker: {type: String},
    sizeOfCake: {type: String, required: true},
    date: {type: String, required: true},
    imageURL: {type: String, },
    ingredients: {type: String, required: true}
});

let cake = mongoose.model('Cake', cakeSchema);

module.exports = cake;