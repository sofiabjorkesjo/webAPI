'use strict';

// let mongoose = require('mongoose');
// let findOrCreate = require('mongoose-find-or-create');

// let userSchema = new mongoose.Schema({
//     githubId: {type: String}
// });

// userSchema.plugin(findOrCreate)

// let user = mongoose.model('User', userSchema);

// module.exports = user;

let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');

let userSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    admin: {type: String}
});

userSchema.plugin(findOrCreate)

let user = mongoose.model('User', userSchema);

module.exports = user;