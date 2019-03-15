const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const localMongoosePlugin = require("passport-local-mongoose");
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        required:true
    },
    results: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Result",
    }
});

userSchema.plugin(localMongoosePlugin);
const Users = mongoose.model("User", userSchema);
module.exports = Users;