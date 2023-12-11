const express = require("express");
const router = express.Router();

const {
    createPlace
} = require("../controllers/places");
const { getAccessToRoute , getAdminAccesToRoute } = require("../middleWares/authorization/auth");



router.post("/create",[getAccessToRoute,getAdminAccesToRoute],createPlace);



module.exports = router;