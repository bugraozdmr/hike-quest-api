const CustomError = require("../../helpers/error/customError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/TokenHelpers");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Comment = require("../../models/Comment");

const getAccessToRoute = (req,res,next) => {
    //* gönderilen değer yani auth.. - bearer.. bu ikisi request oluyorlar
    const {JWT_SECRET_KEY} = process.env;


    // false donerse tersi true dur ve girer
    // 401 unauthorizer - 403 forbidden admin page'e erişmek
    if(!isTokenIncluded(req)){
        
        return next(new CustomError("You are not allowed to access this router",401));
    }
    const access_token = getAccessTokenFromHeader(req);
    
    // decode edecek karsilastiracak ve expire suresine bakacak
    jwt.verify(access_token,JWT_SECRET_KEY,(err,decoded) => {
        
        if(err){
            return next(new CustomError("You are not allowed to access this router",401));
        }

        req.user = {
            id : decoded.id,
            name:  decoded.name
        }

        //! req.user.id burdan erişiliyor kemik bu
        next();
    });

    next();
}

//todo burdan todo access yazılacak -- CommentOwnerAccessOlacak
// const getQuestionOwnerAccess = asyncErrorWrapper(async(req,res,next) => {
//     //! önce routeAccess çalışacak ondan -- req.user.id oluşmuş olacak
//     const userID = req.user.id;
//     const questionID = req.params.id;
    
//     const question = await Question.findById(questionID);
    
    

//     if(question.user != userID) {
//         return next(new CustomError("you can not edit somebody's information",403));
//     }
//     next();
// });

const getCommentOwnerAccesToRoute = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    const comment = await Comment.findById(id);

    if(!comment){
        return next(new CustomError("Comment not exist",400));
    }


    const commentUserId = comment.User;


    if(req.user.id != commentUserId){
        return next(new CustomError("Only owner can delete comment",400));
    }

    next();
});


const getAdminAccesToRoute = asyncErrorWrapper(async(req,res,next) => {
    // aklıma böyle kullanmak geldi
    const userRole = (await User.findById(req.user.id)).role;

    if(userRole != "admin"){
        return next(new CustomError("Only admins can access this route",400));
    }

    next();
});


module.exports = {
    getAccessToRoute,
    getAdminAccesToRoute,
    getCommentOwnerAccesToRoute    
};