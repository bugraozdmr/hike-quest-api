const express = require("express");
const router = express.Router();

const {
    createPlace,
    deleteplace,
    editplace,
    showPlaces,
    dislikePlace,
    likePlace,
    addToFavourite
} = require("../controllers/places");
const { getAccessToRoute , getAdminAccesToRoute } = require("../middleWares/authorization/auth");


// dummy func ()=>...
router.post("/create",[getAccessToRoute,getAdminAccesToRoute,()=>console.log()],createPlace);
router.delete("/delete/:id",[getAccessToRoute,getAdminAccesToRoute,()=>console.log()],deleteplace);
router.put("/edit/:id",[getAccessToRoute,getAdminAccesToRoute,()=>console.log()],editplace);
router.get("/getplaces",showPlaces);
router.post("/dislikeplace/:id",[getAccessToRoute,()=>console.log()],dislikePlace);
router.post("/likeplace/:id",[getAccessToRoute,()=>console.log()],likePlace);
router.post("/addfavourite/:id",[getAccessToRoute,()=>console.log()],addToFavourite);

module.exports = router;