const express = require("express");
const router = express.Router();

const {
    createPlace
} = require("../controllers/places");



router.use("create",createPlace);



module.exports = router;