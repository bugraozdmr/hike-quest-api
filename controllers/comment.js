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
    const user = await User.findById(req.user.id);

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

    user.comments.push(comment.id);
    user.save();

    return res.status(200).json({   
        success : true,
        data : {
            comment : comment.content,
            like_count : comment.likeCount
        }
    });
});

const deleteComment = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    const placeId = (await Comment.findById(id)).place;
    const userId = (await Comment.findById(id)).user;

    const place = await Places.findById(placeId);
    const user = await User.findById(userId);

    const index = place.comments.indexOf(id);
    place.comments.splice(index,1);
    place.save();

    const index2 = user.comments.indexOf(id);
    user.comments.splice(index,1);
    user.save();

    //* en son silme işlemini yap
    await Comment.findByIdAndDelete(id);
 


    return res.status(200).json({
        success : true,
        message : "comment deleted"
    });
});

const editComment = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    const editInformation = req.body;

    const comment = Comment.findByIdAndUpdate(id,editInformation,{
        new : true,
        runValidators : true
    });

    comment.save();

    return res.status(200).json({
        success : true,
        message : "comment edited",
        data : {
            content : comment.content
        }
    });
});

const showAll = asyncErrorWrapper(async(req,res,next) => {
    const comments = Comment.find();

    res.status(200).json({
        data : comments
    });
});


module.exports = {
    createComment,
    deleteComment,
    editComment,
    showAll
}