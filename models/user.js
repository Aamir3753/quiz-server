const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    quizes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz",
    },
});
const Users = mongoose.model("User", userSchema);
module.exports = Users;