const express = require("express");
const Router = express.Router();
const Quizes = require("../models/quiz");

// for adding deleting and getting quizes
Router.route("/")
    .get((req, res, next) => {
        // for getting all the quizes
        Quizes.find({}).select("title description").exec((err, quizes) => {
            if (err) return next(err);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.json({ success: true, quizes: quizes });
        })
    })
    .post((req, res, next) => {
        // for creating a quiz
        Quizes.create(req.body, (err, quiz) => {
            if (err) return next(err);
            else {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json({ success: true, quiz: quiz });
            }
        })
    })
    .delete((req, res, next) => {
        // for deleting all quizes
        Quizes.deleteMany({}, (err, result) => {
            if (err) return next(err);
            else {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json({ success: true, result: result });
            }
        })
    });

Router.route("/:quizId")
    .get((req, res, next) => {
        // for getting quiz detail
        Quizes.findById(req.params.quizId, (err, quiz) => {
            if (err) return next(err);
            else {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json(
                    {
                        success: true,
                        quizDetail: {
                            title: quiz.title,
                            description: quiz.description,
                            totalQuestions: quiz.questions.length
                        }
                    }
                );
            }
        })
    })
    .post((req, res, next) => {
        // for adding a single question
        Quizes.findById(req.params.quizId, (err, quiz) => {
            if (err) return next(err);
            else {
                quiz.questions.push(req.body);
                quiz.save()
                    .then((quiz) => {
                        res.setHeader("Content-Type", "application/json");
                        res.statusCode = 200;
                        res.json({ success: true, questions: quiz.questions });
                    })
                    .catch(err => next(err));
            }
        })
    })
    .delete((req, res, next) => {
        // for deleting a quiz
        Quizes.findByIdAndDelete(req.params.quizId, (err, result) => {
            if (err) return next(err);
            else {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json({ success: true, result: result });
            }
        })
    })
    .put((req, res, next) => {
        // for updating a quiz
        Quizes.findOneAndUpdate({ _id: req.params.quizId },
            { title: req.body.title, description: req.body.description },
            { new: true }, (err, quiz) => {
                if (err) return next(err);
                else {
                    res.setHeader("Content-Type", "application/json");
                    res.statusCode = 200;
                    res.json({ success: true, quiz: quiz });
                }
            })
    })

Router.route("/:quizId/:questionId")
    .put((req, res, next) => {
        // for updating a single question
        Quizes.findById(req.params.quizId, (err, quiz) => {
            if (err) return next(err);
            if (quiz) {
                const updateQuestion = quiz.questions.id(req.params.questionId)
                updateQuestion.question = req.body.question;
                updateQuestion.isMultiselect = req.body.isMultiselect;
                updateQuestion.answer = req.body.answer;
                updateQuestion.options = req.body.options;
                quiz.save()
                    .then(() => {
                        res.setHeader("Content-Type", "application/json");
                        res.statusCode = 200;
                        res.json({ success: true, question: quiz.questions.id(req.params.questionId) });
                    })
                    .catch(err => next(err));
            }
            else {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 404;
                res.json({ success: false, message: "quiz not found" });
            }
        })
    })
    .delete((req, res, next) => {
        // for deleting a single question
        Quizes.findById(req.params.quizId, (err, quiz) => {
            if (err) return next(err);
            quiz.questions.pull(req.params.questionId);
            quiz.save().then(result => {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json({ success: true, result: result });
            })
                .catch(err => next(err));
        })
    })
module.exports = Router;

