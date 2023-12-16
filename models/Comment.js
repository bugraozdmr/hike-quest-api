const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content : {
        type : String,
        required : [true,"add your comment"]
    },
    User : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    username : {
        type : String
    },
    place : {
        type : mongoose.Schema.ObjectId,
        ref : "Places"
    },
    likeCount : {
        type : Number,
        default : 0
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

//! exportS için 20dk bakındım
module.exports = mongoose.model("Comment",CommentSchema);