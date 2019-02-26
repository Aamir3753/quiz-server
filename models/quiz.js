const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
    optionName: {
        type: String,
        required: true
    },
    option: {
        type: String,
        required: true
    }
}, { _id: false });

const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    isMultiselect: {
        type: Boolean,
        required: true
    },
    options: {
        type: [optionSchema],
        required: true,
    },
    answer: {
        type: [String],
        required: true,
    }
});

questionSchema.path("options").validate(function (options) {
    if (options.length === 0 || options.length < 2) return false;
    return true;
}, "Questions should have more than one option");
questionSchema.path("answer").validate(function (answer) {
    if (answer.length === 0 || answer.length >= 1) return false;
    return true;
}, "Questions should have one or more than one answer");
const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        required: true,
    }
})


const Quizes = mongoose.model("Quiz", quizSchema);

module.exports = Quizes;