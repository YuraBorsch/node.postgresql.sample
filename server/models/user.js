'use strict';

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('../../config.js')

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isUnique: function (value, next) {
                        var self = this;
                        User.find({where: {email: value}})
                            .then(function (user) {
                                // reject if a different user wants to use the same email
                                if (user && self.id !== user.id) {
                                    return next('Email already in use!');
                                }
                                return next();
                            })
                            .catch(function (err) {
                                return next(err);
                            });
                    }
                }
            },


            /*email: {
              type: DataTypes.STRING,
              allowNull: false,
              validate: {
                isEmail:true
              },
              unique: {
                args: true,
                msg: 'Email address already in use!'
              }
            },*/

            /*email: {
              type: DataTypes.STRING,
              allowNull: false,
              unique: true
            },*/
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            accessToken: {
            type: DataTypes.STRING,
            allowNull: true,
            }
        }
    );

    // encrypts the password before saving
    User.beforeCreate((user, options) => {
        return bcrypt.hash(user.password, 10)
            .then(hash => {
                user.password = hash;
            })
            .catch(err => {
                throw new Error();
            });
    });
    // validates password
    User.prototype.validatePassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    }
    // overrides toJSON to hide the user password
    User.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.password;
        delete values.accessToken;
        return values;
    }
    // generates JWT
    User.prototype.generateJwt = function() {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        return jwt.sign({
            _id: this._id,
            email: this.email,
            name: this.name,
            exp: parseInt(expiry.getTime() / 1000),
        }, config.jwt_secret);
    };


    return User;
};