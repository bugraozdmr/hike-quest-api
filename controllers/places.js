const Places = require("../models/Places");
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

    const place = Places.findById(id);

    if(!place){
        return next(CustomError("There is no place with given id",400));
    }

    if(place.dislikes.includes(req.user.id)){
        const index = place.dislikes.indexOf(req.user.id);
        
        // silme işlemi yapacak
        place.dislikes.splice(index,1);
        place.dislikeCount = place.dislikes.length;

        await place.save();

        //* dislike silincek ama devam ediyor -- çünkü asıl like eklenmeli
    }


    // tekrar basmışsa sil o like'ı
    if(place.likes.includes(req.user.id)){
        const index = place.likes.indexOf(req.user.id);
        
        // silme işlemi yapacak
        place.likes.splice(index,1);
        place.likeCount = place.likes.length;

        await place.save();

        return res.status(200).json({
            success : true,
            message : "like removed"
        });
    }

    place.likes.push(req.user.id);
    place.likeCount = place.likes.length;

    await place.save();

    return res.status(200).json({
        success : true,
        message : "place liked"
    });
});


const dislikePlace = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    const place = Places.findById(id);

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

        await place.save();

        //* like silincek ama devam ediyor -- çünkü asıl dislike eklenmeli
    }
    

    // dislike tekrar basarsa dislike silinsin
    if(place.dislikes.includes(req.user.id)){
        const index = place.dislikes.indexOf(req.user.id);
        
        place.dislikes.splice(index,1);
        place.dislikeCount = place.dislikes.length;

        await place.save();

        return res.status(200).json({
            success : true,
            message : "dislike removed"
        });
    }

    place.dislikes.push(req.user.id);
    place.dislikeCount = place.dislikes.length;

    await place.save();

    return res.status(200).json({
        success : true,
        message : "place disliked"
    });
});


module.exports = {
    createPlace,
    deleteplace,
    editplace,
    showPlaces,
    dislikePlace,
    likePlace
}