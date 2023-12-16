const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/customError");
const Comment = require("../models/Comment");
const User = require("../models/User");

const createComment = asyncErrorWrapper(async(req,res,next) => {
    // bu çağırılacak id'ile
    const {content} = req.body;
    const {id} = req.params;

    const comment = await Comment.create({
        content : content,
        User : req.user.id,
        username : (await User.findById(req.user.id)).name,
        place : id
    });

    return res.status(200).json({   
        success : true,
        data : {
            comment : comment.content,
            like_count : comment.likeCount
        }
    });
});


module.exports = {
    createComment
}