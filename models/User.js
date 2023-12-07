const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const UserSchema = new Schema({
    name : {
        type : String,
        required : [true,"Please provide a name"]
    },
    surname : {
        type : String,
        required : [true,"Please provide surname"]
    },
    email : {
        type : String,
        required : [true,"email required"],
        unique : [true],
        match : [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Provide a real email"
        ]
    },
    password : {
        type : String,
        minlength: [6,"password has to have at least 6 character"],
        required : [true,"password needed"],
        select : false
    },
    active : {
        type : Boolean,
        default : false
    },
    location : {
        type : String,
    },
    age : {
        type : String,
    },
    gender : {
        type : String,
    },
    profile_image : {
        type : String,
        default : "default.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordTokenExpire : {
        type : Date
    },
    ActivatePasswordToken : {
        type : String
    },
    ActivatePasswordTokenExpire : {
        type : Date
    }
});


UserSchema.methods.getResetPasswordTokenFromUser = function(){
    // working fine
    const randomHexString = crypto.randomBytes(15).toString("hex");
    
    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    // 1 saat surecek 3600000 ms
    this.resetPasswordTokenExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    //* token ve expire time dönüyor
    // console.log(this.resetPasswordToken);
    // console.log(this.resetPasswordTokenExpire);
    return resetPasswordToken;
}

UserSchema.methods.getActivatePasswordToken = function(){
    // working fine
    const randomHexString = crypto.randomBytes(15).toString("hex");
    
    const {ACTIVATE_PASSWORD_EXPIRE} = process.env;
    
    const activatePasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
    
    // console.log(`activate token : ${activatePasswordToken}`);

    this.ActivatePasswordToken = activatePasswordToken;
    // 1 saat surecek 3600000 ms
    this.ActivatePasswordTokenExpire = Date.now() + parseInt(ACTIVATE_PASSWORD_EXPIRE);

    //* token ve expire time dönüyor
    // console.log(this.resetPasswordToken);
    // console.log(this.resetPasswordTokenExpire);
    return activatePasswordToken;
}



UserSchema.methods.generateJwtFromUser = function(){
    const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env;
    const payload = {
        id : this._id,
        name : this.name
    };

    const token = jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn : JWT_EXPIRE
    });
    // Token oluştu
    return token;
};


// this userSchema'dır o da name,email vs tutar - arrow function içerde olmazsa bcrypte içinde this temsil olmaz -- userschema this tutmalı ondna function
UserSchema.pre("save",function(next){
    // password has not changed
    if(!this.isModified("password")){
        next();
    };
    bcrypt.genSalt(10 , (err,salt) => {
        if(err) next(err);
        bcrypt.hash(this.password,salt,(err,hash) => {
            if(err) next(err);
            this.password = hash;
            next();
        });
    });
});

UserSchema.post("deleteOne",async function(){
    // Userdan eleman silindiğinde o elemanın tüm sorularıda gitsin -- user._id alacak ve question içindeki id ile kıyaslayacak
    //!bunun için baya uğraştım this.getQuery ile çektik ona göre
    const user = this.getQuery();       // get query js code u ben yazmadım

    // await Question.deleteMany({
    //     user : user._id
    // });

});


module.exports = mongoose.model("User",UserSchema);