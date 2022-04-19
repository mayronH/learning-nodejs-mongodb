const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
require("../models/Post");

const Category = mongoose.model("categories");
const Post = mongoose.model("posts");

const validation = require("../controller/admin");

router.get("/", (req, res) => {
    res.render("admin/index");
});

router.get("/posts", (req, res) => {
    Post.find()
        .lean()
        .populate("category")
        .sort({ date: "desc" })
        .then((posts) => {
            res.render("admin/posts", { posts: posts });
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao exibir postagens, tente novamente mais tarde");
            res.redirect("/admin");
        });
});

router.get("/posts/add", (req, res) => {
    Category.find()
        .lean()
        .then((categories) => {
            res.render("admin/addPost", { categories: categories });
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao exibir categorias, tente novamente mais tarde");
            res.redirect("/admin");
        });
});

router.post("/posts/new", (req, res) => {
    const errors = validation.validatePost(req);

    if (errors.length > 0) {
        res.render("admin/addPost", { errors: errors });
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            category: req.body.category,
            description: req.body.description,
            content: req.body.content,
        };

        Post.create(newPost)
            .then(() => {
                req.flash("success_msg", "Postagem criada com sucesso!");
                res.redirect("/admin/posts");
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao salvar a postagem, tente novamente mais tarde");
                res.redirect("/admin");
            });
    }
});

router.get("/posts/edit/:id", (req, res) => {
    Post.findById(req.params.id)
        .lean()
        .then((post) => {
            Category.find()
                .lean()
                .then((categories) => {
                    res.render("admin/editPost", { categories: categories, post: post });
                })
                .catch((error) => {
                    req.flash("error_msg", "Erro ao exibir categorias, tente novamente mais tarde");
                    res.send("/admin/posts");
                });
        })
        .catch((error) => {
            req.flash("error_msg", "Essa postagem não existe");
            res.send("/admin/posts");
        });
});

router.post("/posts/edit", (req, res) => {
    const errors = validation.validatePost(req);

    if (errors.length > 0) {
        res.render("admin/editPost", { errors: errors });
    } else {
        Post.findById(req.body.id)
            .then((post) => {
                post.title = req.body.title;
                post.slug = req.body.slug;
                post.description = req.body.description;
                post.category = req.body.category;
                post.content = req.body.content;

                post.save()
                    .then(() => {
                        req.flash("success_msg", "Postagem editada com sucesso!");
                        res.redirect("/admin/posts");
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro interno ao salvar a postagem, tente novamente mais tarde");
                        res.redirect("/admin/posts");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao editar a postagem, tente novamente mais tarde");
                res.send("/admin/posts");
            });
    }
});

router.get("/posts/delete/:id", (req, res) => {
    Post.remove({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "Postagem excluída com sucesso!");
            res.redirect("/admin/posts");
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao deletar a postagem, tente novamente mais tarde");
            res.send("/admin/posts");
        });
});

router.get("/posts/show/:id", (req, res) => {
    Post.findById(req.params.id)
        .lean()
        .populate("category")
        .then((post) => {
            res.render("admin/post", { post: post });
        })
        .catch((error) => {
            req.flash("error_msg", "Essa postagem não existe");
            res.send("/admin/posts");
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
            res.redirect("/admin");
        });
});

router.get("/categories/add", (req, res) => {
    res.render("admin/addCategory");
});

router.post("/categories/new", (req, res) => {
    const errors = validation.validateCategory(req);

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
                res.redirect("/admin");
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
            res.send("/admin/categories");
        });
});

router.post("/categories/edit", (req, res) => {
    const errors = validation.validateCategory(req);

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
                        res.send("/admin/categories");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao editar a categoria, tente novamente mais tarde");
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
            res.send("/admin/categories");
        });
});

module.exports = router;
