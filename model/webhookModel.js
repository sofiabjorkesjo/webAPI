'use strict';

let mongoose = require('mongoose');

let webhookSchema = new mongoose.Schema({
    url: {type: String},
});

let webhook = mongoose.model('Webhook', webhookSchema);

module.exports = webhook;