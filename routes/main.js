'use strict';

let router = require('express').Router();
let passport = require('passport');
let cakeSchema = require('../model/cakeModel');
let webHooks = require('node-webhooks');
let loggedIn = false;

router.get('/', function(req, res) {   
    let links = {
        'All cakes': 'http://localhost:8000/cakes' ,
        'All bakers': 'http://localhost:8000/bakers'
    };

    res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(links, null, 4));

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
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(cake, null, 4));
        }
    });
});

router.delete('/:cakeId', function(req, res) {
    cakeSchema.findOneAndRemove({_id: req.params.cakeId}, function(err, cake) {
        if(err) {
            res.send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(cake, null, 4));
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
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(cakeMap, null, 4));

        }
    });

});

router.get('/cakes/:cakeId', function(req, res) {
    cakeSchema.find({_id: req.params.cakeId}, function(err, information) {
        if(err) {
            res.send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(information, null, 4));
        }
    });
});

router.get('/bakers', function(req, res) {
    if(loggedIn === false) {
        let obj = {
            'message': 'You need to be logged in',
            'link': 'http://localhost:8000/auth/github'
        };
        res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(obj, null, 4));
    } else {
        cakeSchema.find({}, function(err, bakers) {
            if(err) {
                res.send(err);
            } else {
                let bakersMap = [];
                bakers.forEach(function(obj){       
                    let baker = obj.baker;
                    let link = 'http://localhost:8000/bakers/' + obj.baker;
                    let logOutLink = 'http://localhost:8000/logOut';
            
                    let info = {
                        'baker': baker,
                        'All the bakers cakes': link,
                        'logout': logOutLink
                    };
                    bakersMap.push(info); 
                })
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(bakersMap, null, 4));
            }
        })
    }   
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}), function(req, res){
    loggedIn = true;
    res.redirect('/bakers')
});

router.get('/logOut', function(req, res) {
    req.logout();
    loggedIn = false;
    res.send({'message': 'logged out!'});
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
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(allCakes, null, 4));
        }
    });
});

module.exports = router;