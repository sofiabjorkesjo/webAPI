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

router.get('/:cakeId', function(req, res) {
    cakeSchema.findOne({_id: req.params.cakeId}, function(err, cake) {
        if(err) {
            res.send(err);
        } else {
            res.json(cake);
        }
    });
});

router.put('/:cakeId', function(req, res) {
    cakeSchema.findOneAndUpdate({_id: req.params.cakeId},
        {sortOfCake: req.body[0].sortOfCake,
        baker: req.body[0].baker,
        sizeOfCake: req.body[0].sizeOfCake,
        date: req.body[0].date,
        imageURL: req.body[0].imageURL,
        ingredients: req.body[0].ingredients},
        function(err, cake) {
        if(err) {
            res.send(err);
        } else {
            res.json(cake);
        }
    });
});

router.delete('/:cakeId', function(req, res) {
    cakeSchema.findOneAndRemove({_id: req.params.cakeId}, function(err, cake) {
        if(err) {
            res.send(err);
        } else {
            res.send(cake);
        }
    });
});

router.get('/cakes', function(req, res) {
    cakeSchema.find({}, function(err, cakes) {
        if(err) {
            res.send(err);
        } else {
            let cakeMap = [];
            cakes.forEach(function(cake) {
                let sort = cake.sortOfCake;
                let link = 'http://localhost:8000/cakes/' + cake._id;
                let obj = {
                    'sortOfCake': sort,
                    'more information': link
                };
                cakeMap.push(obj);
            });
            res.send(cakeMap);

        }
    });
});

router.get('/cakes/:cakeId', function(req, res) {
    cakeSchema.find({_id: req.params.cakeId}, function(err, information) {
        if(err) {
            res.send(err);
        } else {
            res.send(information);
        }
    });
});

router.get('/bakers', function(req, res) {
    cakeSchema.find({}, function(err, bakers) {
        if(err) {
            res.send(err);
        } else {
            let bakersMap = [];
            bakers.forEach(function(obj){       
                let baker = obj.baker;
                let link = 'http://localhost:8000/bakers/' + obj.baker;

                let info = {
                    'baker': baker,
                    'All the bakers cakes': link
                };

                bakersMap.push(info); 
            })
            let test = [];

            // for(let i = 0; i < bakersMap.length; i++) {
            //     for(let j = 0; j <= test.length; j++) {
            //         if(test.length == 0){
            //             test.push(bakersMap[i]); 
            //         } 
            //         if(bakersMap[i].baker == test[j].baker) {
            //             console.log('sssss');
            //         } else {
            //             test.push(bakersMap[i]);
            //         }
            //     }
                
            // }
            res.send(bakersMap);
        }
    })
});

router.get('/bakers/:bakerName/', function(req, res) {
    cakeSchema.find({baker: req.params.bakerName}, function(err, information) {
        if(err) {
            res.send(err);
        } else {
            let allCakes = [];
            information.forEach(function(cake) {
                console.log(cake.sortOfCake);
                let result = {
                    'baker': cake.baker,
                    'cake': cake.sortOfCake
                }
               
                allCakes.push(result);
            });
            res.send(allCakes);
        }
    });
});
module.exports = router;