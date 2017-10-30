'use strict';
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
    },
  });
  User.associate = (models) => {};
  User.prototype.verifyPassword = function(password, callback) {
    if (password == this.password) callback(true);
    callback(false);
    //return [this.firstname, this.lastname].join(' ');
  };
  return User;
};