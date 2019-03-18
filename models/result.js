const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    wrongAnswers: {
        type: [String],
        required: true,
        default:[]
    },
    obtainedPercentage: {
        type: Number,
        required: true,
        default: 0
    },
    result: {
        type: Boolean,
        required:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        require:true
    }
},{timestamps:true});
const Results = mongoose.model("Result", resultSchema);
module.exports = Results