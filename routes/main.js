'use strict';

let router = require('express').Router();
let cakeSchema = require('../model/cakeModel');

router.get('/', function(req, res) {  
    cakeSchema.find({}, function(err, result) {
        console.log('m');
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
})
.post('/', function(req, res) {
    console.log('postar');
    let cake = new cakeSchema({
        sortOfCake: 'marrängtårta',
        baker: 'sofia',
        sizeOfCake: 'stor',
        date: new Date,
        imageURL: 'test',
        ingredients: 'marränger'
    });
    cake.save(function(err, result) {
        if(err) {
            res.send(err);
        } else {
            res.json(result);
        }     
    })
});

module.exports = router;