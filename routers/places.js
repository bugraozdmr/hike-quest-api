const express = require("express");
const router = express.Router();

const {
    createPlace,
    deleteplace,
    editplace
} = require("../controllers/places");
const { getAccessToRoute , getAdminAccesToRoute } = require("../middleWares/authorization/auth");


// dummy func ()=>...
router.post("/create",[getAccessToRoute,getAdminAccesToRoute,()=>console.log()],createPlace);
router.delete("/delete/:id",[getAccessToRoute,getAdminAccesToRoute,()=>console.log()],deleteplace);
router.put("/edit/:id",[getAccessToRoute,getAdminAccesToRoute,()=>console.log()],editplace);


module.exports = router;