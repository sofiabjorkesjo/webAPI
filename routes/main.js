'use strict';

let router = require('express').Router();
let cakeSchema = require('../model/cakeModel');

router.get('/', function(req, res) {  
    cakeSchema.find({}, function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
})
.post('/', function(req, res) {
    let cake = new cakeSchema({
        sortOfCake: 'chokladtårta',
        baker: 'sofia',
        sizeOfCake: 'stor',
        date: new Date,
        imageURL: 'test',
        ingredients: 'marränger, choklad'
    });
    cake.save(function(err, result) {
        if(err) {
            res.send(err);
        } else {
            res.json(result);
        }     
    })
});

router.put('/:cakeId', function(req, res) {
    cakeSchema.findOneAndUpdate({_id: req.params.cakeId}, {baker: 'hej'}, function(err, cake) {
        if (err) {
            res.send(err);
        } else {
            res.json(cake);
        }
    });
});

router.delete('/:cakeId', function(req, res) {
    cakeSchema.findOneAndRemove({_id: req.params.cakeId}, function(err, cake) {
        if (err) {
            res.send(err);
        } else {
            res.send(cake);
        }
    })
})

module.exports = router;