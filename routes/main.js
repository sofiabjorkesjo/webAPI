'use strict';

let router = require('express').Router();
let passport = require('passport');
let cakeSchema = require('../model/cakeModel');
let webhook = require('../model/webhookModel');
let User = require('../model/user');
let events = require('events');
let request = require('request');
let app = require('../app');
let jwt = require('jsonwebtoken');
let eventEmitter = new events.EventEmitter();

router.get('/', function(req, res) {
    let links = {
        'All cakes': process.env.URL + '/cakes' ,
        'All bakers': process.env.URL + '/bakers',
        'Register': process.env.URL + '/register',
        'Authenticate': process.env.URL + '/authenticate'
    };
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({'message': '200 OK. ', links}, null, 4));    
});



router.get('/cakes', function(req, res) {
    cakeSchema.find({}, function(err, cakes) {
        if(err) {
            res.status(404).send(err);
        } else {
            let cakeMap = [];
            let links = {
                'Back to start': process.env.URL
            }
            cakeMap.push(links);
                
            cakes.forEach(function(cake) {
                let sort = cake.sortOfCake;
                let link = process.env.URL + '/cakes/' + cake._id;
                let obj = {
                    'sortOfCake': sort,
                    'more information': link
                };
                cakeMap.push(obj);
            });
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({'message': '200 OK. ', cakeMap}, null, 4));
        }
    });
});

router.get('/bakers', function(req, res) {
    cakeSchema.find({}, function(err, obj) {
        if(err) {
            res.status(404).send({'message': '404 Not Found. ', err});
        } else {
            var bakers = [];
            function remove_duplicates(arr) {
                var obj = {};
                bakers = [];
                for (var i = 0; i < arr.length; i++) {
                    obj[arr[i].baker] = true;
                }
                for (var key in obj) {
                    bakers.push(key);
                }
                return bakers;
            }
            remove_duplicates(obj);
            let bakersMap = [];

            let links = {
                'Post one url to this link to create a webhook to listen to posts of new cakes': process.env.URL + '/webhook',
                'back to start': process.env.URL
            }
            bakersMap.push(links);

            bakers.forEach(function(name) {
                let info = {
                    'Baker': name,
                    'All the bakers cakes': process.env.URL + '/bakers/' + name
                }
                bakersMap.push(info);
            });
               
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({'message': '200 OK. ', bakersMap}, null, 4));
        }
    })
});



router.get('/:userURL', function(req, res) {
    webhook.find({url: req.params.userURL}, function(err) {
        if(err) {
            res.status(404).send({'message': '404 Not Found ', err});
        } else {
            eventEmitter.on('new', function(data) {
                let info = [];
                let obj = {
                    message: 'One new cake has been post',
                    sortOfCake: data.sortOfCake,
                    baker: data.baker,
                    sizeOfCake: data.sizeOfCake,
                    date: data.date,
                    imageURL: data.imageURL,
                    ingredients: data.ingredients
                }
                info.push(obj);
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify({'message': '200 OK ', info}, null, 4));
            });
        } 
    });
});

router.get('/register', function(req, res) {
    res.status(200).send({'message': '200 OK. You need to post username and password to this route to reguster'})

}).post('/register', function(req, res) {
    User.findOrCreate({username: req.body[0].username, password: req.body[0].password, admin: 'true'}, function(err, result){
        if (err) {
            let error = err;
            res.status(500).send({'message': '500 Internal Server Error ', error})
        } else {
            res.status(200).send({'message': '200 OK. Successful registered', 'Autenticate': process.env.URL + '/authenticate'})
        }
    })
});

router.post('/authenticate', function(req, res) {
    User.findOne({username: req.body[0].username}, function(err, user) {
        if(err) {
            if(!user) {
                console.log('ingen user')
                res.status(404).send({'message': '404 Not Found. Write username'})
            }
        } else {
            if(user === null) {
                res.status(401).send({'message': '401 Unauthorized'})
            } else if(user.password != req.body[0].password) {
                res.status(401).send({'message': '401 Unauthorized'})
            } else {
                let payload = {
                    admin: user.admin
                };
                let token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 1000
                });
                res.status(200).send({'message': '200 OK. Send the token in headern as x-access-token', 'token': token, 'start': process.env.URL})
            }
        }
    })
});

router.use(function(req, res, next) {
    let token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                res.status(401).send({'message': '401. Unauthorized', err});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            'message': '403 Forbidden. You need to send a token',
            'register': process.env.URL + '/register',
            'Autenticate': process.env.URL + '/authenticate'
        });
    }
});


router.post('/', function test(req, res) {
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
            res.status(404).send({'message': '404 Bad request', err});
        } else {
            eventEmitter.emit('new', cake);  
            res.status(200).send({'message': '200 OK. Cakes posted',result});
        }
    })
});

router.put('/:cakeId', function(req, res) {
    cakeSchema.findOneAndUpdate({_id: req.params.cakeId},
        {sortOfCake: req.body[0].sortOfCake,
        baker: req.body[0].baker,
        sizeOfCake: req.body[0].sizeOfCake,
        date: req.body[0].date,
        imageURL: req.body[0].imageURL,
        ingredients: req.body[0].ingredients},
        {new: true},
        function(err, cake) {
        if(err) {
            console.log('EROROORORO');
            console.log(err);
            res.status(500).send({'message': '500 Internal Server Error ', err});
        } else {
            if(cake.ingredients === null && cake.imageURL === null && cake.date === null && cake.sizeOfCake === null && cake.baker === null && cake.sortOfCake === null) {
                res.status(400).send({'message': '400. Bad request.'})
            } else if (cake.baker === "" || cake.sortOfCake === "" || cake.sizeOfCake === "" || cake.date === "" || cake.ingredients === "" || cake.aboutBaker === "" || cake.imageURL === "") {
                res.status(400).send({'message': '400. Bad request.'})
            } else if (cake.baker === null || cake.sortOfCake === null || cake.sizeOfCake === null || cake.date === null || cake.ingredients === null) {
                res.status(400).send({'message': '400. Bad request.'})
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify({'message': '200 OK. Cake updated', cake}, null, 4));
            }
          
        }
    });
});

router.delete('/:cakeId', function(req, res) {
    cakeSchema.findOneAndRemove({_id: req.params.cakeId}, function(err, cake) {
        if(err) {
            res.status(500).send({'message': '500 Internal Server Error', err});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({'message': '200 OK. Cake deleted'}, null, 4));
        }
    });
});

router.get('/cakes/:cakeId', function(req, res) {
    cakeSchema.find({_id: req.params.cakeId}, function(err, information) {
        if(err) {
            res.status(500).send({'message': '500 Internal Server Error ', err});
        } else { 
            let link = {
                'Back to start': process.env.URL,
                'Update this cake': process.env.URL + '/' + req.params.cakeId,
                'Delete this cake': process.env.URL + '/' + req.params.cakeId
            }
            information.push(link)                
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({'message': '200 OK ', information}, null, 4));
        }
    });
});



router.get('/bakers/:bakerName/', function(req, res) {
    cakeSchema.find({baker: req.params.bakerName}, function(err, information) {
        if(err) {
            res.status(500).send({'message': '500 Internal Server Error ', err});
        } else {
            let allCakes = [];
            let links = {
                'Back to start': process.env.URL
            }
            allCakes.push(links);
            information.forEach(function(cake) {
                let result = {
                    'baker': cake.baker,
                    'cake': cake.sortOfCake
                }           
                allCakes.push(result);
            });
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({'message': '200 OK. ', allCakes}, null, 4));
        }
    });
});

router.post('/webhook', function (req, res) {
    let Webhook = new webhook({
        url: req.body[0].url
    });

    Webhook.save(function(err, result) {
        if(err) {
            res.status(500).send({'message': '500 Internal Server Error ', err});
        } else {
            res.status(200).send({'message': '200 OK. Webhook saved ', result});
        }
    });
});

router.get('/oneCake/:cakeId', function(req, res) {
    cakeSchema.findOne({_id: req.params.cakeId}, function(err, cake) {
        if(err) {
            res.status(500).send({'message': '500 Internal Server Error ', err});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({'message': '200 OK ', cake}, null, 4));
        }
    });
});

module.exports = router;