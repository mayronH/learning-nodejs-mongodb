const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const admin = require("./routes/admin");
const path = require("path");

// Config
// configurando sessão
app.use(
    session({
        secret: "teste",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// Salvando variavéis globais
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
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

//Route
app.use("/admin", admin);

// Server
app.listen(8080, () => {
    console.log("Server running on : http://localhost:8080");
});
