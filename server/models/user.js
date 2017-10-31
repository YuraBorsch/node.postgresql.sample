'use strict';

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }
  /*{
    instanceMethods:{
        validatePassword:function(password){
          return bcrypt.compareSync(password, this.password);
        }
      }*/
  );

  //User.associate = (models) => {};

  /*User.beforeCreate(function(user, options) {
    return cryptPassword(user.password)
      .then(success => {
        user.password = success;
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });

  function cryptPassword(password) {
    console.log("cryptPassword" + password);
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        // Encrypt password using bycrpt module
        if (err) return reject(err);

        bcrypt.hash(password, salt, null, function(err, hash) {
          if (err) return reject(err);
          return resolve(hash);
        });
      });
    });
  }; */

  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10)
      .then(hash => {user.password = hash;})
      .catch(err => { throw new Error(); });
  });

  User.prototype.validatePassword = function (password) {
    console.log(password);
    return bcrypt.compareSync(password, this.password);
  }

  return User;
};