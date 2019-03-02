const express = require("express");
const Router = express.Router();
const Quizes = require("../models/quiz");
const authenticate = require("../authenticate");
const Results = require("../models/result");

Router.route("/:quizId")
    .get(authenticate.verifyUser, (req, res, next) => {
        Quizes.findById(req.params.quizId)
            .select("questions")
            .exec((err, quiz) => {
                if (err) return next(err);
                else {
                    const result = new Results({
                        user: req.user._id,
                        quiz: req.params.quizId
                    })
                    result.save((err, result) => {
                        if (err) return next(err);
                        res.setHeader("Content-Type", "application/json");
                        res.statusCode = 200;
                        res.json({
                            success: true,
                            questions: quiz.questions.map(question => ({
                                _id: question._id,
                                question: question.question,
                                options: question.options
                            }))
                        })
                    })
                }
            })
    })
module.exports = Router;