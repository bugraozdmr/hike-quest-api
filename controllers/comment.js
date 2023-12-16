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

    place.comments.push(comment.id);
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


//? comment silinince user-comment-place'den silinir toplu --

const deleteComment = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;
 
    const placeId = (await Comment.findById(id)).place;
    // User paremetre buyuk harfliymis
    const userId = (await Comment.findById(id)).User;

    const place = await Places.findById(placeId);
    const user = await User.findById(userId);

    if(!user){
        return next(new CustomError("user not exist"));
    }

    if(!place){
        return next(new CustomError("place not exist"));
    }

    const index = place.comments.indexOf(id);
    place.comments.splice(index,1);
    place.save();

    const index2 = user.comments.indexOf(id);
    user.comments.splice(index2,1);
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
    // await !
    const comment = await Comment.findByIdAndUpdate(id,editInformation,{
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
    const comments = await Comment.find();

    res.status(200).json({
        data : comments
    });
});

const likeComment = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    const comment = await Comment.findById(id);

    if(comment.likes.includes(req.user.id)){
        const index = comment.likes.indexOf(req.user.id);

        comment.likes.splice(index);

        comment.likeCount = comment.likes.length;    

        comment.save();
        //return yoksa devam eder hata alır
        return res.status(200).json({
            success : true,
            message : "like removed from comment"
        });
    }


    comment.likes.push(req.user.id);
    comment.likeCount = comment.likes.length;
    comment.save();

    res.status(200).json({
        success : true,
        message : "liked comment"
    });
});

module.exports = {
    createComment,
    deleteComment,
    editComment,
    showAll,
    likeComment
}