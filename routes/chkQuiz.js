const Quizes = require("../models/quiz");
const Results = require("../models/result");
const chkQuiz = (req, res, next) => {
    const solvedQuiz = req.body;
    let passingScore = 0;
    Quizes.findById(solvedQuiz.quizId)
        .select("questions passingScore")
        .exec((err, quiz) => {
            if (err) return next(err);
            else if (!quiz) {
                let err = new Error("Quiz not found");
                return next(err);
            }
            else if (!quiz.questions.length) {
                let err = new Error("Questions not found");
                return next(err);
            }
            else {
                passingScore = quiz.passingScore;
                let quizMarks = 0;
                let wrongQuestions = []
                try {
                    solvedQuiz.answers.forEach(answer => {
                        let question = quiz.questions.id(answer.questionId);
                        let oneQuestionMarks = 1 / question.answer.length
                        if (question.answer.length > 1) {
                            answer.answer.forEach(userAnswer => {
                                if (question.answer.includes(userAnswer)) {
                                    quizMarks += oneQuestionMarks;
                                } else {
                                    quizMarks -= oneQuestionMarks;
                                    wrongQuestions.push(answer.questionId);
                                }
                            })
                        }
                        else {
                            answer.answer.forEach(userAnswer => {
                                if (question.answer.includes(userAnswer)) {
                                    quizMarks++;
                                } else {
                                    wrongQuestions.push(answer.questionId);
                                }
                            })
                        }
                    })
                    Results.findOneAndUpdate(
                        { quiz: solvedQuiz.quizId },
                        {
                            obtainedPercentage: (quizMarks * 100) / quiz.questions.length < 0 ? 0:(quizMarks * 100) / quiz.questions.length,
                            wrongAnswers: wrongQuestions,
                            result: passingScore >= ((quizMarks * 100) / quiz.questions.length) ? "false" : "true",
                        },
                        { new: true }
                    )
                        .then((result) => {
                            res.setHeader("Content-Type", "application/json");
                            res.statusCode = 200;
                            res.json(
                                {
                                    success: true,
                                    result: result
                                }
                            )
                        })
                }
                catch (err) {
                    next(err);
                }
            }
        })
}

module.exports = chkQuiz;

// it will take solved quiz which contains 
// quizId  and an array of answer objects which contains
// questionId and an array of answers.

