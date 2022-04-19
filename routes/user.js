const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

require("../models/User");

const validation = require("../controller/user");

const User = mongoose.model("users");

router.get("/signup", (req, res) => {
    res.render("user/signup");
});

router.post("/signup", (req, res) => {
    const errors = validation.validateUser(req);

    if (errors.length > 0) {
        res.render("user/signup", { errors: errors });
    } else {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    req.flash("error_msg", "Email já cadastrado");
                    res.redirect("/user/signup");
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    });

                    // Criar uma Hash da senha
                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if (error) {
                                req.flash("error_msg", "Houve um erro interno, tente novamente mais tarde");
                                res.redirect("/");
                            } else {
                                newUser.password = hash;

                                newUser
                                    .save()
                                    .then(() => {
                                        req.flash("success_msg", "Usuário registrado com sucesso");
                                        res.redirect("/user/login");
                                    })
                                    .catch((error) => {
                                        req.flash(
                                            "error_msg",
                                            "Erro ao salvar novo usuário, tente novamente mais tarde"
                                        );
                                        res.redirect("/");
                                    });
                            }
                        });
                    });
                }
            })
            .catch((error) => {
                req.flash("error_msg", "Houve um erro interno");
                res.redirect("/");
            });
    }
});

router.get("/login", (req, res) => {
    res.render("user/login");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login",
        failureFlash: true,
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success_msg", "Até breve");
    res.redirect("/");
});

module.exports = router;
