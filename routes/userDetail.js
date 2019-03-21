const express = require("express");
const Router = express.Router();
const authenticate = require("../authenticate")
const Users = require("../models/user");
const Results = require("../models/result");

// For getting user detail
Router.route("/")
    .get(authenticate.verifyUser, (req, res, next) => {
        Users.findById(req.user._id, (err, user) => {
            if (err) return next(err);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.json({ success: true, user: user })
        })
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Results.deleteMany({ user: req.user._id }, (err) => {
            if (err) return next(err);
            Users.findByIdAndDelete(req.user._id, (err, result) => {
                if (err) return next(err);
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json({ success: true, message: "Account deleted!" })
            })

        })
    })

module.exports = Router;