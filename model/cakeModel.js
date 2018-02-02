'use strict';

let mongoose = require('mongoose');

let cakeSchema = new mongoose.Schema({
    sortOfCake: {type: String},
    baker: {type: String},
    sizeOfCake: {type: String},
    date: {type: Date},
    imageURL: {type: String},
    ingredients: {type: String}
});

let cake = mongoose.model('Cake', cakeSchema);

module.exports = cake;