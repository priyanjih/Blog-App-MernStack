const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);
const secret = "wdw2e12eqwdqd2";

app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // CORS middleware

mongoose.connect("mongodb://127.0.0.1:27017/BlogApp");

app.use(express.json()); // Body parser middleware

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username: username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, (err, token) => {
      res.cookie("token", token).json("ok");
    });
  } else {
    res.status(401).json({ message: "Wrong credentials" });
  }
});

app.listen(4000);
