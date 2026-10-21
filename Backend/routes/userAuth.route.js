const { Router } = require("express");
const userDetails = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userAuthRouter = Router();

// SIGNUP
userAuthRouter.post("/signup", async (req, res) => {
  try {
    const existingUser = await userDetails.findOne({
      email: req.body.email,
    });
    if(existingUser){
      return res.status(409).json({message:"Email already exists"});
    }
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await userDetails.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: newPassword,
      token: "",
    });
    res.json({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.json({ status: "ERROR", error: "Duplicate Email" });
  }
});

// LOGIN
userAuthRouter.post("/login", async (req, res) => {
  try {
    if (!process.env.SECRET_KEY) {
      console.error("Login requires SECRET_KEY in Backend/.env");
      return res.status(503).json({ status: "ERROR", error: "Authentication is not configured" });
    }

    const user = await userDetails.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ status: "ERROR", error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ status: "ERROR", error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      process.env.SECRET_KEY
    );
    user.token = token;
    await user.save();
    return res.json({ status: "OK", user: token });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ status: "ERROR", error: "Login failed" });
  }
});

// LOGOUT
userAuthRouter.post("/logout", async (req, res) => {
  try {
    const { token } = req.headers;
    const user = await userDetails.findOne({ token: token });
    console.log('user:', user)
    if (user) {
      user.token = "";
      await user.save();
      res.status(200).json({ message: "logout successfully" });
    } else {
      res.status(400).json({ error: "invalid token" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = userAuthRouter;
