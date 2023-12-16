const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/customError");
const Comment = require("../models/Comment");

const createComment = asyncErrorWrapper(async(req,res,next) => {
    const {content} = req.body;

    const comment = await Comment.create({
        content : content
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