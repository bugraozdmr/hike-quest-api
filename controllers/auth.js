//! loginde-register'da accesstoken güncellenir
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/TokenHelpers");
const CustomError = require("../helpers/error/customError");
const {ValidateUserInput , comparePassword} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");


// todo  Burda yapılan çoğu işlem frontendde nasıl kullanılacağı hangi parametreler ile çalıştığı vs söylenmeli

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


    //* sending email

    
    // bu method useri değiştirdiğinden save edilecek sonda
    const ActivatePasswordToken = user.getActivatePasswordToken();

    console.log(ActivatePasswordToken);

    // patladı
    await user.save();


    activateAccountUrl = `http://localhost:5000/api/auth/activate?activatePasswordToken=${ActivatePasswordToken}`
    
    
    const emailTemplate = `
        <h3>Hey ${name}</h3>
        <p> Click this <a href = "${activateAccountUrl} target="_blank">link</a> to activate your account</p>
    `;

    
    try{
        await sendEmail({
            from : process.env.SMTP_USER,
            to : email,
            subject : "Activate your Account",
            html : emailTemplate
        });

        
        return res.status(200).json({
            success : true,
            message : "message sent to your email",
        });
    }
    // hata varsa resetPassword token ve expire geri alınmalı
    catch (error){
        // yollarken sorun oluşursa yani zaten emaili seçti o aşama geçti sonrasında hata olursa undefined yapcak
        user.ActivatePasswordToken = undefined;
        user.ActivatePasswordTokenExpire = undefined;

        await user.save();
        
        return next(new CustomError("Email could not be sent",500));
    }




    sendJwtToClient(user,res);

    // artık bu çözlünce bilgi gelir
});


const activateAccount = asyncErrorWrapper(async(req,res,next) => {
    // parametre değerleri query'de
    const {activatePasswordToken} = req.query;

    console.log(activatePasswordToken);

    if(!activatePasswordToken) {
        return next(new CustomError("Token not exist",400));
    }

    let user = await User.findOne({
        ActivatePasswordToken : activatePasswordToken,
        ActivatePasswordTokenExpire : {$gt : Date.now()}
    });

    if(!user) {
        return next(new CustomError("User doesn't exist"));
    }

    user.active = true;

    user.activatePasswordToken = undefined;
    user.ActivatePasswordTokenExpire = undefined;

    await user.save();

    return res.status(200).json({
        success : true,
        message : "account activated",
        data : {
            email : user.email,
            active : user.activate
        }
    });
});



// todo silinecek galiba yeri değişebilir admin access'i bu
// todo sonrasında query kullanarak sıralama işlemleri yazılacak
const getAllUser = async (req,res,next)=>{
    
    try{
        const users = await User.find();

        res.json({
            success: true,
            data : {
                users
                
            }
        });
    }
    catch (error){
        next(error);
    }
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

    if(!user){
        return next(new CustomError("user not exist",400));
    }

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

const forgotPassword = asyncErrorWrapper(async(req,res,next) => {
    const resetEmail = req.body.email;


    // beklemezse promise olarak kalır ve !user felan görmez tipi farklı
    const user = await User.findOne({email : resetEmail});
    

    if(!user) {
        return next(new CustomError("There is no user with that email",400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    // tekrardan save ediliyor en sonda ve bekleniyor
    //? yukardaki getResetPasswordTokenFromUser üzerinden resetpassword token ataması yapılıyor
    //? save edilmesi burda yapılmış ordada yapılabilirdi
    await user.save();

    // console.log(user.resetPasswordToken);

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p> This <a href = "${resetPasswordUrl} target="_blank">link</a> will expire in 1 hour </p>
    `;

    try{
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset your password",
            html : emailTemplate
        });

        return res.status(200).json({
            success : true,
            message : "token sent to your email",
        });
    }
    // hata varsa resetPassword token ve expire geri alınmalı
    catch (error){
        // yollarken sorun oluşursa yani zaten emaili seçti o aşama geçti sonrasında hata olursa undefined yapcak
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;

        await user.save();
        
        return next(new CustomError("Email could not be sent",500));
    }
});

const resetPassword = asyncErrorWrapper(async(req,res,next) => {
    //query parametreleri linkten alınıyor
    const {resetPasswordToken} = req.query;
    //todo sonradan alınacak bu değer uçacak
    const {password} = req.body;

    console.log(resetPasswordToken,password);
    //todo
    // http://localhost:5000/api/auth/resetpassword?resetPasswordToken=f2ad1cdd398d4e8cc963178f6f95e93e6c53fcf2df43d64529d0c1cfbce952cd%20target=
    //! %20target= silinmesi gerek yoksa çalışmıyor direkt blank olmadan çalıştır
    if(!resetPasswordToken){
        return next(new CustomError("Token doesn't exist",400));
    }
    let user = await User.findOne({     // gt : greaterthan daha buyuk olsun expire olmamış olsun
        resetPasswordToken : resetPasswordToken,
        resetPasswordTokenExpire : {$gt : Date.now()}
    });
    
    

    if(!user) {
        
        return next(new CustomError("Invalid Token or Session Expired",400));
    }

    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save();

    return res.status(200)
    .json({
        success : true,
        message : "password reset complete"
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
    getAllUser,
    login,
    logout,
    editDetails,
    forgotPassword,
    resetPassword,
    activateAccount
};