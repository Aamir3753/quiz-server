const express = require('express');
const Router = express.Router();
const Users = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

Router.post("/signup", (req, res, next) => {
  const { username, password, firstname, lastname ,gender} = req.body;
  Users.register(new Users({
    username,
    password,
    firstname,
    lastname,
    gender
  }), req.body.password, (err, user) => {
    if (err) return next(err);
    else {
      user.save((err, user) => {
        if (err) return next(err);
        else {
          const token = authenticate.getToken({ _id: user._id, firstname: user.firstname, img: user.img });
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.json({ token: token, success: true })
        }
      })
    }
  })
});

Router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 401;
      res.json({ success: false, message: "Login Unsuccessful", info: info })
      return;
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, status: 'Login Unsuccessful!', err: err });
        return;
      }
      const token = authenticate.getToken({ _id: req.user._id, username: req.user.username, firstname: req.user.firstname, lastname: req.user.lastname, img: req.user.img }
        , req.body.remember ? 3600 * 24 * 30 : 3600);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Login Successful!', token: token });
    })
  })(req, res, next);
})

Router.get("/facebook/login", passport.authenticate("facebook-token"), (req, res, next) => {
  const token = authenticate.getToken({ _id: req.user._id, username: req.user.username, firstname: req.user.firstname, lastname: req.user.lastname, img: req.user.img });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, token: token })
})
module.exports = Router;
