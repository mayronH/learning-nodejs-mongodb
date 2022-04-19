const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/User");

const User = mongoose.model("users");

module.exports = router;
