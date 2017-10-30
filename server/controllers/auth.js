// Load required packages
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../models').User;

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
        if (user.password!=password) { return callback(null, false); }

        // Success
        else return callback(null, user);
    })
    .catch(err => {return callback(err);});
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });