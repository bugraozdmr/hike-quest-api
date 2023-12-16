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
    likeCount : {
        type : Number,
        default : 0
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.export = mongoose.model("Comment",CommentSchema);