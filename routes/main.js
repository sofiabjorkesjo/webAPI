'use strict';

let router = require('express').Router();
let cakeSchema = require('../model/cakeModel');

router.get('/', function(req, res) {   
    let links = {
        'All cakes': 'http://localhost:8000/cakes' ,
        'All bakers': 'http://localhost:8000/bakers'
    };

    res.send(links);

}).post('/', function(req, res) {
    console.log(req.body[0].baker); 
    let cake = new cakeSchema({
        sortOfCake: req.body[0].sortOfCake,
        baker: req.body[0].baker,
        sizeOfCake: req.body[0].sizeOfCake,
        date: req.body[0].date,
        imageURL: req.body[0].imageURL,
        ingredients: req.body[0].ingredients,
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