'use strict';

let router = require('express').Router();
let passport = require('passport');
let cakeSchema = require('../model/cakeModel');
let loggedIn = false;

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
        aboutBaker: req.body[0].aboutBaker,
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

// router.get('/:cakeId', function(req, res) {
//     cakeSchema.findOne({_id: req.params.cakeId}, function(err, cake) {
//         if(err) {
//             res.send(err);
//         } else {
//             res.json(cake);
//         }
//     });
// });

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
    if(loggedIn === false) {
        let obj = {
            'message': 'You need to be logged in',
            'link': 'http://localhost:8000/auth/github'
        };
        res.send(obj);
    } else {
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
    
                res.send(bakersMap);
            }
        })
    }
    
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}), function(req, res){
    loggedIn = true;
    res.redirect('/bakers')
})


router.get('/bakers/:bakerName/', function(req, res) {
    cakeSchema.find({baker: req.params.bakerName}, function(err, information) {
        if(err) {
            res.send(err);
        } else {
            let allCakes = [];
            information.forEach(function(cake) {
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