const Places = require("../models/Places");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const customError = require("../helpers/error/customError");
const CustomError = require("../helpers/error/customError");

const createPlace = asyncErrorWrapper(async(req,res,next) => {
    const {name,city,county} = req.body;

    const place = await Places.create({
        name : name,
        city : city,
        county : county
    });

    res.status(200).json({
        success : true,
        data : place
    });
});

const deleteplace = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    await Places.findByIdAndDelete(id);

    return res.status(200).json({
        success : true,
        message : "place deleted"
    });
});

// params direkt /:id -- querry ?id= olurdu

const editplace = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    const editInformation = req.body;

    // yeniden oluştuma gibi düşün
    const place = await Places.findByIdAndUpdate(id,editInformation,{
        new : true,
        runValidators : true
    });

    
    //? slugify çalışsın diye save
    place.save();

    res.status(200).json({
        success : true,
        data : place
    });

});

const showPlaces = asyncErrorWrapper(async(req,res,next) => {
    const places = await Places.find();

    res.status(200).json({
        message : "success",
        data : places
    });
});


const likePlace = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    // await unutma
    const place = await Places.findById(id);
    // req.user.id dışında başka bir şey dönmüyor bize access tokendan ondan biz tam nesneye ihtiyaç duyarız
    const userToUse = await User.findById(req.user.id);


    if(!place){
        return next(CustomError("There is no place with given id",400));
    }

    //todo
    if(place.dislikes.includes(req.user.id)){
        
        const index = place.dislikes.indexOf(req.user.id);
        
        // silme işlemi yapacak
        place.dislikes.splice(index,1);
        place.dislikeCount = place.dislikes.length;
        //aşşağıda yazılamadı hata alıyordu
        place.likes.push(req.user.id);
        place.likeCount = place.likes.length;

        await place.save();



        //? userdan silme
        const index2 = userToUse.dislikedPlaces.indexOf(id);
        // place id'si silinecek
        userToUse.dislikedPlaces.splice(index2,1);
        //direkt eklesin yoksa hata alıyor altta
        userToUse.likedPlaces.push(id);

    
        // count yazılmadı burda gereksiz çünkü
        await userToUse.save();
        
        

        return res.status(200).json({
            success : true,
            message : "place liked"
        });
    }


    // tekrar basmışsa sil o like'ı
    if(place.likes.includes(req.user.id)){
        const index = place.likes.indexOf(req.user.id);
        
        // silme işlemi yapacak
        place.likes.splice(index,1);
        place.likeCount = place.likes.length;

        await place.save();


        //? user işlemleri
        const index2 = userToUse.likedPlaces.indexOf(id)
        userToUse.likedPlaces.splice(index2,1);
        userToUse.save();


        return res.status(200).json({
            success : true,
            message : "like removed"
        });
    }

    place.likes.push(req.user.id);
    place.likeCount = place.likes.length;

    await place.save();


    //? user işlemleri
    userToUse.likedPlaces.push(id);
    await userToUse.save();


    return res.status(200).json({
        success : true,
        message : "place liked"
    });
});


const dislikePlace = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    const place = await Places.findById(id);
    const userToUse = await User.findById(req.user.id).select('-password');

    if(!place){
        return next(CustomError("There is no place with given id",400));
    }


    // todo burda bir helper yazılabilirdi like helper dislike helper şeklinde
    // öncesinde like attıysa o like gitmeli
    if(place.likes.includes(req.user.id)){
        const index = place.likes.indexOf(req.user.id);
        
        // silme işlemi yapacak
        place.likes.splice(index,1);
        place.likeCount = place.likes.length;
        
        //! iki işlemde burda yaptı çünkü aşağıda user işlemi yaparken hata fırlatıyor çözemedim.Çözüm bu
        place.dislikes.push(req.user.id);
        place.dislikeCount = place.dislikes.length;
        
        await place.save();

        
        //? userdan silme
        
        
        const index2 = userToUse.likedPlaces.indexOf(id);
        // place id'si silinecek
        userToUse.likedPlaces.splice(index2,1);
        // count yazılmadı burda gereksiz çünkü
        userToUse.dislikedPlaces.push(id);
        await userToUse.save();
        

        return res.status(200).json({
            success : true,
            message : "place disliked"
        });
    }
    

    // dislike tekrar basarsa dislike silinsin
    if(place.dislikes.includes(req.user.id)){
        const index = place.dislikes.indexOf(req.user.id);
        
        place.dislikes.splice(index,1);
        place.dislikeCount = place.dislikes.length;

        await place.save();

        

        //? user işlemleri
        const index2 = userToUse.dislikedPlaces.indexOf(id);
        userToUse.dislikedPlaces.splice(index2,1);
        userToUse.save();

        
        return res.status(200).json({
            success : true,
            message : "dislike removed"
        });
    }

    place.dislikes.push(req.user.id);
    place.dislikeCount = place.dislikes.length;

    await place.save();


    //? user işlemleri

    

    userToUse.dislikedPlaces.push(id);
    
    await userToUse.save();
    
    return res.status(200).json({
        success : true,
        message : "place disliked"
    });
});


const addToFavourite = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;
    // user bulunur zaten getaccessroute'dan geliyor
    const user = await User.findById(req.user.id);
    const place = await Places.findById(id);

    if(!place){
        return next(new CustomError("There is no place has that id"));
    }

    //* varsa geri çeksin
    if(place.favouriteUsers.includes(req.user.id)){
        const index = place.favouriteUsers.indexOf(req.user.id);
        place.favouriteUsers.splice(index,1);

        await place.save();

        const index2 = user.favouritePlaces.indexOf(id);
        user.favouritePlaces.splice(index2,1);

        await user.save();


        return res.status(200).json({
            success : true,
            message : "deleted from favourites"
        });
    }

    place.favouriteUsers.push(req.user.id);
    await place.save();

    user.favouritePlaces.push(id);
    await user.save();

    return res.status(200).json({
        success : true,
        message : "place added to favourites",
        data : {
            place_name : place.name
        }
    })
});




module.exports = {
    createPlace,
    deleteplace,
    editplace,
    showPlaces,
    dislikePlace,
    likePlace,
    addToFavourite
}