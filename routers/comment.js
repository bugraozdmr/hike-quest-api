const express = require("express");

const {
    createComment
} = require("../controllers/comment");

const {getAccessToRoute} = require("../middleWares/authorization/auth");

const router = express.Router();

// bu burda olmaz
router.post("/commentplace/:id",[getAccessToRoute,()=>console.log()],createComment);
router.put("/edit",);
router.delete("/delete",);
router.get("/show",);





module.exports = router;