// https://expressjs.com/en/4x/api.html#res.cookie

const sendJwtToClient = (user,res) => {
    const token = user.generateJwtFromUser();
    const {JWT_COOKIE,NODE_ENV} = process.env;

    return res
    .status(200)
    .cookie("access_token",token,{
        httpOnly : true,
        // JWT_COOKIE * sn
        expires : new Date(Date.now() + parseInt(JWT_COOKIE)*1000*60),
        secure : NODE_ENV === "development" ? false : true
    })
    .json({
        success : true,
        message : "please activate your account before log in",
        access_token : token,
        data : {
            name : user.name,
            email : user.email
        }
    })
};

const isTokenIncluded = (req) => {
    
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer");
}

const getAccessTokenFromHeader = (req) => {
    
    const authorization = req.headers.authorization;
    
    // 1.deger access token - 0. bearer:
    const access_token = authorization.split(" ")[1];
    return access_token;
}


module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader
};