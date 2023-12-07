
//* adminler için
const checkUserExist = async(req,res,next) => {
    try{
        const password = req.body.password;

        const userId = req.user.id;

        const user = await User.findById(userId);

        if(!comparePassword(password,passwordDb)){
            return next(new CustomError("there is no user with that id"));
        }
    
        User.deleteOne({_id : userId});
    }
    catch(err){
        next(err);
    }
}