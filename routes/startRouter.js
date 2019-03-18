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
                else if (!quiz) {
                    res.setHeader("Content-Type", "application/json");
                    res.statusCode = 404;
                    res.json({ success: false })
                    return
                }
                else {
                    Results.findOne({ quiz: quiz._id }, (err, dbResult) => {
                        if (err) return next(err)
                        if (dbResult) {
                            res.setHeader("Content-Type", "application/json");
                            res.statusCode = 200;
                            res.json({
                                success: true,
                                questions: quiz.questions.map(question => ({
                                    _id: question._id,
                                    isMultiselect: question.isMultiselect,
                                    question: question.question,
                                    options: question.options
                                }))
                            })
                            return
                        }
                        const result = new Results({
                            user: req.user._id,
                            quiz: req.params.quizId,
                            result: false,
                        })
                        result.save((err, result) => {
                            if (err) return next(err);
                            if (!result) {
                                res.setHeader("Content-Type", "application/json");
                                res.statusCode = 404;
                                res.json({ success: false })
                                return
                            }
                            res.setHeader("Content-Type", "application/json");
                            res.statusCode = 200;
                            res.json({
                                success: true,
                                questions: quiz.questions.map(question => ({
                                    _id: question._id,
                                    isMultiselect: question.isMultiselect,
                                    question: question.question,
                                    options: question.options
                                }))
                            })
                        })
                    })
                }
            })
    })
module.exports = Router;