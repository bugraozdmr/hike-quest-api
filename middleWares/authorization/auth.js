const CustomError = require("../../helpers/error/customError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/TokenHelpers");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");


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

        next();
    });

    next();
}

//todo burdan todo access yazılacak
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



module.exports = {
    getAccessToRoute,
    
    // getQuestionOwnerAccess,
    
};