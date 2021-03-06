const Sequelize = require('sequelize');
const logger = require('morgan');
const User = require('../models').User;



module.exports = {
    create(req, res) {
        return User
            .create({
                email: req.body.email,
                password: req.body.password,
            })
            .then(user => res.status(201).send(user))
            .catch(Sequelize.ValidationError, function (err) {
                // respond with validation errors
                return res.status(422).send(err.errors);
            })
            .catch(error => res.status(400).send(error));
    },
    getAll(req, res) {
        return User
            .findAll()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error));
    },
    get(req, res) {
        return User
            .findById(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    },
    getCurrent(req, res) {
        var token;
        var authHeader = req.headers['authorization'];
        if (authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7, authHeader.length);
        } else {
            res.status(400).send({
                message: 'User Not Found',
            });
        }
        //console.log("getCurrent, token="+token);
        return User
            .findOne({where:{ accessToken: token }})
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        return User
            .findById(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                return user
                    .update({
                        email: req.body.email || user.email,
                        password: req.body.password || user.password,
                    })
                    .then(() => res.status(200).send(user))  // Send back the updated todo.
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
};