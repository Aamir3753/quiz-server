const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

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
        type: [String],
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
    if (answer.length === 0) return false;
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
    },
    passingScore: {
        type: Number,
        required: true,
        max: 100
    }
})

quizSchema.plugin(mongoosePaginate);
const Quizes = mongoose.model("Quiz", quizSchema);

module.exports = Quizes;