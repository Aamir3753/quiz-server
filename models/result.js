const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    wrongAnswers: {
        type: [String],
        required: true,
    },
    obtainedPercentage: {
        type: Number,
        required: true,
        default: 0
    },
    result: {
        type: Boolean,
        required: true
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