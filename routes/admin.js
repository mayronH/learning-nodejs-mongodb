const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
require("../models/Post");

const Category = mongoose.model("categories");

router.get("/", (req, res) => {
    res.render("admin/index");
});

router.get("/posts", (req, res) => {
    res.render("admin/posts");
});

router.get("/posts/add", (req, res) => {
    Category.find()
        .lean()
        .then((categories) => {
            res.render("admin/addPost", { categories: categories });
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao exibir categorias, tente novamente mais tarde");
            console.log(error);
            res.send("/admin");
        });
});

router.get("/categories", (req, res) => {
    Category.find()
        .sort({ date: "desc" })
        .lean()
        .then((categories) => {
            res.render("admin/categories", { categories: categories });
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao exibir categorias, tente novamente mais tarde");
            console.log(error);
            res.send("/admin");
        });
});

router.get("/categories/add", (req, res) => {
    res.render("admin/addCategory");
});

router.post("/categories/new", (req, res) => {
    let errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: "Nome inválido" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Slug inválido" });
    }

    if (req.body.name.length < 2) {
        errors.push({ text: "Nome muito curto, pelo menos 2 caracteres" });
    }

    if (errors.length > 0) {
        res.render("admin/addCategory", { errors: errors });
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug,
        };

        Category.create(newCategory)
            .then(() => {
                req.flash("success_msg", "Categoria criada com sucesso!");
                res.redirect("/admin/categories");
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao salvar categoria, tente novamente mais tarde");
                console.log(error);
                res.send("/admin");
            });
    }
});

router.get("/categories/edit/:id", (req, res) => {
    Category.findById(req.params.id)
        .lean()
        .then((category) => {
            res.render("admin/editCategory", { category: category });
        })
        .catch((error) => {
            req.flash("error_msg", "Essa categoria não existe");
            console.log(error);
            res.send("/admin/categories");
        });
});

router.post("/categories/edit", (req, res) => {
    let errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: "Nome inválido" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Slug inválido" });
    }

    if (req.body.name.length < 2) {
        errors.push({ text: "Nome muito curto, pelo menos 2 caracteres" });
    }

    if (errors.length > 0) {
        res.render("admin/editCategory", { errors: errors });
    } else {
        Category.findById(req.body.id)
            .then((category) => {
                category.name = req.body.name;
                category.slug = req.body.slug;

                category
                    .save()
                    .then(() => {
                        req.flash("success_msg", "Categoria editada com sucesso!");
                        res.redirect("/admin/categories");
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro interno ao salvar a categoria, tente novamente mais tarde");
                        console.log(error);
                        res.send("/admin/categories");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao editar a categoria, tente novamente mais tarde");
                console.log(error);
                res.send("/admin/categories");
            });
    }
});

router.get("/categories/delete/:id", (req, res) => {
    Category.remove({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "Categoria excluída com sucesso!");
            res.redirect("/admin/categories");
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao deletar a categoria, tente novamente mais tarde");
            console.log(error);
            res.send("/admin/categories");
        });
});

module.exports = router;
