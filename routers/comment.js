const express = require("express");

const {getAccessToRoute} = require("../middleWares/authorization/auth");

const router = express.Router();


router.use("/create",[getAccessToRoute,()=>console.log()],);
router.use("/edit",);
router.use("/delete",);
router.use("/show",);





module.exports = router;