const express = require("express");
const Router = express.Router();
const Quizes = require("../models/quiz");

// for adding deleting and getting quizes
Router.route("/")
    .get((req, res, next) => {
        Quizes.find({}, (err, quizes) => {
            if (err) return next(err);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.json({ success: true, quizes: quizes });
        })
    })
    .post((req, res, next) => {
        Quizes.create(req.body, (err, result) => {
            if (err) return next(err);
            else {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json({ success: true });
            }
        })
    })
    .delete((req, res, next) => {
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
        Quizes.findById(req.params.quizId, (err, quiz) => {
            if (err) return next(err);
            else {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json({ success: true, questions: quiz.questions });
            }
        })
    })
    .post((req, res, next) => {
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
        Quizes.findById(req.params.quizId, (err, quiz) => {
            if (err) return next(err);
            if (quiz) {
                const updateQuestion = quiz.questions.id(req.params.questionId)
                updateQuestion.question = req.body.question;
                updateQuestion.isMultiselect = req.body.isMultiselect;
                updateQuestion.answer = req.body.answer;
                updateQuestion.options = req.body.options;
                quiz.save()
                    .then(result => {
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
module.exports = Router;