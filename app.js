const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

require("./models/Post");
require("./models/Category");
require("./config/auth")(passport);

const app = express();
const admin = require("./routes/admin");
const user = require("./routes/user");
const path = require("path");

const Post = mongoose.model("posts");
const Category = mongoose.model("categories");

// Config
// Configurando sessão
app.use(
    session({
        secret: "teste",
        resave: true,
        saveUninitialized: true,
    })
);

// Configurando autenticação
app.use(passport.initialize());
app.use(passport.session());

// Flash message
app.use(flash());

// Salvando variavéis globais
app.use((req, res, next) => {
    // Flash messages
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    // Passport flash message
    res.locals.error = req.flash("error");
    // Logged User
    res.locals.user = req.user || null;
    next();
});

// Configurando o express para utilizar o parser em json
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

// Configurando a template engine handlebars
const handle = handlebars.create({
    defaultLayout: "main",
});
app.engine("handlebars", handle.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Conexão com o mongodb
mongoose
    .connect("mongodb://localhost/blogapp")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log(error);
    });

//Routes
app.get("/", (req, res) => {
    Post.find()
        .lean()
        .populate("category")
        .sort({ date: "desc" })
        .then((posts) => {
            res.render("index", { posts: posts });
        })
        .catch((error) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/404");
        });
});

app.get("/post/:slug", (req, res) => {
    Post.findOne({ slug: req.params.slug })
        .lean()
        .then((post) => {
            if (post) {
                res.render("post/index", { post: post });
            } else {
                req.flash("error_msg", "Esta postagem não existe");
                res.redirect("/");
            }
        })
        .catch((error) => {
            req.flash("Houve um erro interno");
            res.redirect("/");
        });
});

app.get("/categories", (req, res) => {
    Category.find()
        .sort({ date: "desc" })
        .lean()
        .then((categories) => {
            res.render("category/index", { categories: categories });
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao exibir categorias, tente novamente mais tarde");
            res.redirect("/");
        });
});

app.get("/categories/:slug", (req, res) => {
    Category.findOne({ slug: req.params.slug })
        .lean()
        .then((category) => {
            if (category) {
                Post.find({ category: category._id })
                    .lean()
                    .then((posts) => {
                        res.render("category/posts", { posts: posts, category: category });
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro ao listar as postagens desta categoria");
                        req.redirect("/categories");
                    });
            } else {
                req.flash("error_msg", "Esta categoria não existe");
                res.redirect("/categories");
            }
        })
        .catch((error) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/");
        });
});

app.get("/404", (req, res) => {
    res.send("404");
});

// Admin Routes
app.use("/admin", admin);

// User Routes
app.use("/user", user);

// Server
app.listen(8080, () => {
    console.log("Server running on : http://localhost:8080");
});
