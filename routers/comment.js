const express = require("express");

const {
    createComment,
    deleteComment,
    editComment,
    showAll
} = require("../controllers/comment");

const {getAccessToRoute,
    getCommentOwnerAccesToRoute
} = require("../middleWares/authorization/auth");

const router = express.Router();



const logFunction = () => console.log();



//* create commentte place id alır -- diğerlerinde commentid
router.post("/commentplace/:id",[getAccessToRoute,logFunction],createComment);
router.put("/edit/:id",[getAccessToRoute,getCommentOwnerAccesToRoute,logFunction],editComment);
router.delete("/delete/:id",[getAccessToRoute,getCommentOwnerAccesToRoute,logFunction],deleteComment);
router.get("/show",showAll);


module.exports = router;