const Quizes = require("../models/quiz");
const chkQuiz = (solvedQuiz, res, next) => {
    Quizes.findById(solvedQuiz.quizId)
        .select("questions")
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
                let quizMarks = 0;
                let wrongQuestions = []
                try {
                    solvedQuiz.answers.forEach(answer => {
                        let question = quiz.questions.id(answer.questionId);
                        debugger
                        let oneQuestionMarks = 1 / question.answer.length
                        debugger
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
                    debugger
                    res.setHeader("Content-Type", "application/json");
                    res.statusCode = 200;
                    res.json(
                        {
                            success: true,
                            quizPer: (quizMarks * 100) / quiz.questions.length,
                            wrongQuestions: wrongQuestions,
                            quizId: solvedQuiz.quizId
                        }
                    )
                }
                catch (err) {
                    console.log(err);
                    debugger;
                }
            }
        })
}

module.exports = chkQuiz;

// it will take solved quiz which contains 
// quizId  and an array of answer objects which contains
// questionId and an array of answers.