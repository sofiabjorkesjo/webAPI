'use strict';

let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');

let userSchema = new mongoose.Schema({
    githubId: {type: String}
});

userSchema.plugin(findOrCreate)

let user = mongoose.model('User', userSchema);

module.exports = user;