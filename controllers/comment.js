const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/customError");

const createComment = asyncErrorWrapper(async(req,res,next) => {
    
});