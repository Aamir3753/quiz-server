const express = require("express");
const Router = express.Router();

const chkQuiz = require("./chkQuiz");
Router.route("/")
    .post((req, res, next) => {
        chkQuiz(req.body, res, next);
    });

module.exports = Router;