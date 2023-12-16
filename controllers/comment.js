const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/customError");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Places = require("../models/Places");


//todo -- comment sadece place'e bağlı -- 
const createComment = asyncErrorWrapper(async(req,res,next) => {
    // bu çağırılacak id'ile
    const {content} = req.body;
    const {id} = req.params;

    const place = await Places.findById(id);

    if(!place){
        return next(new CustomError("Place does not exist",400));
    }

    const comment = await Comment.create({
        content : content,
        User : req.user.id,
        username : (await User.findById(req.user.id)).name,
        place : id
    });

    //? places'da işlemler

    place.comments.push(id);
    place.save();

    return res.status(200).json({   
        success : true,
        data : {
            comment : comment.content,
            like_count : comment.likeCount
        }
    });
});


const editComment = asyncErrorWrapper(async(req,res,next) => {
    
});


module.exports = {
    createComment
}