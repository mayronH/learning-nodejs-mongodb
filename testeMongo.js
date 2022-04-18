const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost/tutorial_mongo")
    .then(() => {
        console.log("Success");
    })
    .catch((error) => {
        console.log(error);
    });

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    country: String,
});

mongoose.model("users", UserSchema);

const users = mongoose.model("users");

users
    .create({
        firstName: "Teste",
        lastName: "Testando",
        email: "teste@teste.com",
        age: 30,
        country: "Brazil",
    })
    .then(() => {
        console.log("User Created!");
    })
    .catch((error) => {
        console.log(error);
    });
