const Places = require("../models/Places");
const asyncErrorWrapper = require("express-async-handler");
const customError = require("../helpers/error/customError");

const createPlace = asyncErrorWrapper((req,res,next) => {
    
});


module.exports = {
    createPlace
}