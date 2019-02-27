const Quizes = require("../models/quiz");
const chkQuiz = (solvedQuiz) => {
    Quizes.findById(solvedQuiz._id)
        .select("questions")
        .exec((err, quiz) => {
            if (err) return { err: err }
            else if (!quiz) {
                let err = new Error("Quiz not found");
                return { err: err };
            }
            else if (!quiz.questions.length) {
                let err = new Error("Questions not found");
                return { err: err };
            }
            else {
                let totalWrongAnswers = 0
                let totalRightAnswers = 0;
                let quizPer = 0;
                try {
                    solvedQuiz.answers.map(answer => {
                        let chkWrongAnswer = 0;
                        let question = quiz.question.id(answer.questionId);
                        let oneQuestionMarks = 1 / question.answer.length
                        question.answer.forEach((rigthAnswer) => {
                            answer.answer.forEach(userAnswer => {
                                if (rigthAnswer === userAnswer) {
                                    quizPer = quizPer + oneQuestionMarks;
                                    chkWrongAnswer++;
                                }

                            })
                        })
                        if (chkWrongAnswer > 0) {
                            totalWrongAnswers++;
                        } else {
                            totalRightAnswers++;
                        }
                    })
                }
                catch (err) {

                }
            }
        })
}