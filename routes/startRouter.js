const express = require("express");
const Router = express.Router();
const Quizes = require("../models/quiz");

Router.route("/:quizId")
    .get((req, res, next) => {
        Quizes.findById(req.params.quizId)
            .select("questions")
            .exec((err, quiz) => {
                if (err) return next(err);
                else {
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
                }
            })
    })
module.exports = Router;