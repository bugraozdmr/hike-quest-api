const CustomError = require("../../helpers/error/customError");

const customErrorHandler = (err,req,res,next) => {
    
    let customError = err;
    console.log(customError.message,customError.status);
    
    if(err.code == 11000){ //email has already taken -- bu hata birden cok yerde gelebiliyor unique : true ise
        customError = new CustomError("duplicate key error - please provide a unique value",400);
    }
    // mongodb özel hatası fırlıyor id tanımına uygun olmayan id gidince
    if(err.name === "CastError"){
        customError = new CustomError("please provide a valid id -- proper");
    }


    res
    .status(customError.status || 500)
    .json({
        succes : false ,
        message : customError.message
    });
};

module.exports = customErrorHandler;