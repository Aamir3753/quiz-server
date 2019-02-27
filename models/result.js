const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    rightAnswers: {
        type: Number,
        required: true,
        default: 0
    },
    wrongAnswers: {
        type: Number,
        required: true,
        default: 0
    },
    obtainedPercentage: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    }
});
const Results = mongoose.model("Result", resultSchema);
module.exports = Results