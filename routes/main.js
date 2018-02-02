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
    res.send('hej');
    console.log('hej');
})
.post(function(req, res) {
    let cake = new cakeSchema({
        sortOfCake: 'prinsesstårta',
        baker: 'Sofia',
        sizeOfCake: 'small',
        date: new Date,
        imageURL: 'test',
        ingredients: 'mjöl, socker'
    });
    cake.save(function(err, result) {
        if(err) {
            console.log('feel');
            res.send(err);
        } else {
            console.log('sparas');
            res.json(result);
        }
        
    })
})

module.exports = router;