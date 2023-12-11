const Places = require("../models/Places");
const asyncErrorWrapper = require("express-async-handler");
const customError = require("../helpers/error/customError");

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
    const place = await Places.findOneAndUpdate({_id: id},editInformation,{
        new : true,
        runValidators : true
    });

    res.status(200).json({
        success : true,
        data : place
    });

});



module.exports = {
    createPlace,
    deleteplace,
    editplace
}