//! loginde-register'da accesstoken güncellenir
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/TokenHelpers");
const CustomError = require("../helpers/error/customError");
const {ValidateUserInput , comparePassword} = require("../helpers/input/inputHelpers");





const register = asyncErrorWrapper(async(req,res,next) => {
    //postman test
    //  var object = pm.response.json();
    //  pm.environment.set("access_token", object.access_token);
    const {name,surname,email,password} = req.body;

    const user = await User.create({
        name,
        surname,
        email,
        password
    });

    sendJwtToClient(user,res);

    // artık bu çözlünce bilgi gelir
});
// todo silinecek galiba
const getUser = (req,res,next)=>{
    res.json({
        success: true,
        data : {
            id : req.user.id,
            name : req.user.name
        }
    })
};

const login = asyncErrorWrapper(async(req,res,next) => {
    //postman test
    //var object = pm.response.json();
    //pm.environment.set("access_token", object.access_token);
    const {email,password} = req.body;

    if(!ValidateUserInput(email,password)){
        return next(new CustomError("missing argument/s"));
    }

    const user = await User.findOne({email}).select("+password");

    // - !false = true
    if(!comparePassword(password,user.password)) {
        return next(new CustomError("password or email wrong",400));
    }

    // tokeni guncellemek için
    sendJwtToClient(user,res);
});

const logout = asyncErrorWrapper(async(req,res,next) => {
    // pm.environment.set("access_token","none"); --postman test içine
    const {NODE_ENV} = process.env;
    //* parantezlere dikkat
    return res.status(200)
    .cookie({
        httpOnly : true,
        expires : new Date(Date.now()),
        secure : NODE_ENV == "development" ? false : true
    }).json({
        success : true,
        message : "logged out"
    });
});


const editDetails = asyncErrorWrapper(async(req,res,next) => {
    const editInformation = req.body;
    
    const user = await User.findByIdAndUpdate(req.user.id,editInformation,{
        new : true,
        runValidators : true
    });
    return res.status(200).json({
        success : true,
        data : user
    })

});





module.exports = {
    register,
    getUser,
    login,
    logout,
    editDetails
};