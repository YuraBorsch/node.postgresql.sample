// Load required packages
const passport = require('passport');
const jwt = require("jsonwebtoken");
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer');
const User = require('../models').User;
const config = require('../../config.js')

passport.use(new BasicStrategy(
    function(username, password, callback) {
        User.findOne({where:{ email: username }})
            .then(user => {

                // No user found with that username
                if (!user) { return callback(null, false); }

                // Make sure the password is correct
                //user.verifyPassword(password, function(err, isMatch) {
                //if (err) { return callback(err); }

                // Password did not match
                if (user.validatePassword(password)==true) { return callback(null, user); }

                // Success
                else return callback(null, false);
            })
            .catch(err => {return callback(err);});
    }
));


passport.use(new BearerStrategy(
    function(token, callback) {
        console.log('token', token);
        User.findOne({where:{ accessToken: token }})
            .then(user => {

                // No user found with that token
                if (!user) { return callback(null, false); }

                // User found
                return callback(null, user);

            })
            .catch(err => {return callback(err);});
    }
));


module.exports.isAuthenticated = passport.authenticate('basic', { session : false });

module.exports.isTokenAuthenticated = passport.authenticate('bearer', { session : false });


module.exports.signIn = function(req, res) {
    User.findOne({where:{ email: req.body.email }})
        .then(user => {
            if (!user) {
                res.status(401).json({ message: 'Authentication failed. User not found.' });
            } else if (user) {
                if (!user.validatePassword(req.body.password)) {
                    res.status(401).json({ message: 'Authentication failed. Wrong password.' });
                } else {
                    var token = jwt.sign({ email: user.email}, config.jwt_secret);
                    user.update({
                        accessToken: token,
                    })
                        .then(() => { return res.status(200).json({accessToken: token});})
                        .catch((error) => res.status(400).send(error));
                }
            }
        });
};