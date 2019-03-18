const express = require("express");
const Router = express.Router();
const Results = require("../models/result");
const authenticate = require("../authenticate")
const Quizes = require("../models/quiz");

const chkQuiz = require("./chkQuiz");
// Get results
Router.route("/")
    .get(authenticate.verifyUser, (req, res, next) => {
        // for getting all the results of a user
        Results.find({ user: req.user._id })
            .select("obtainedPercentage result")
            .populate("quiz", "title")
            .exec((err, results) => {
                if (err) return next(err);
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json({ result: results, success: true });
            })
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        // for submiting the quiz
        chkQuiz(req, res, next);
    });

Router.route("/:resultId")
    .get(authenticate.verifyUser, (req, res, next) => {
        // for getting wrong questions
        Results.findById(req.params.resultId)
            .populate("quiz", "title")
            .exec((err, result) => {
                if (err) return next(err);
                if (!result) {
                    res.setHeader("Content-Type", "application/json");
                    res.statusCode = 404;
                    res.json({ success: false, message: "Result not found" });
                    return;
                }
                if (result.wrongAnswers.length !== 0) {
                    Quizes.findById(result.quiz, (err, quiz) => {
                        if (err) return next(err);
                        if (!quiz) {
                            res.setHeader("Content-Type", "application/json");
                            res.statusCode = 404;
                            res.json({ success: false, message: "Quiz not found!" });
                            return;
                        }
                        let repeatQuestions = [];
                        result.wrongAnswers.forEach(questionId => repeatQuestions.push(quiz.questions.id(questionId)))
                        res.setHeader("Content-Type", "application/json");
                        res.statusCode = 200;
                        let resultDetail = {
                            result: result,
                            repeatQuestions: repeatQuestions,
                        }
                        res.json({ success: true, resultDetail: resultDetail });
                    })
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.statusCode = 200;
                    let resultDetail = {
                        result: result
                    }
                    res.json({ success: true, resultDetail: resultDetail })
                }
            })
    })

module.exports = Router;