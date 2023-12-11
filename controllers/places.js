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
});



module.exports = {
    createPlace
}