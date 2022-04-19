const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/User");

const User = mongoose.model("users");

module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
            User.findOne({ email: email }).then((user) => {
                if (!user) {
                    return done(null, false, { message: "Email não encontrado" });
                }

                bcrypt.compare(password, user.password, (erro, equal) => {
                    if (equal) {
                        return done(null, user);
                    }

                    return done(null, false, { message: "Senha incorreta" });
                });
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
        });
    });
};
