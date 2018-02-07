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

router.get('/update', function(req, res) {
    cakeSchema.findOneAndUpdate({_id: "5a747642376ec2fc3d5d3ed1"}, {baker: 'hej'}, function(err, cake) {
        console.log('test');
        if (err) {
            res.send(err);
        } else {
            res.json(cake);
        }
    });
});

router.get('/delete', function(req, res) {
    cakeSchema.findOneAndRemove({_id: "5a7aba4df7840031dad59cab"}, function(err, cake) {
        if (err) {
            res.send(err);
        } else {
            res.send('cake deleted');
        }
    })
})

module.exports = router;