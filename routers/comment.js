const express = require("express");

const {
    createComment,
    deleteComment,
    editComment,
    showAll,
    likeComment
} = require("../controllers/comment");

const {getAccessToRoute,
    getCommentOwnerAccesToRoute
} = require("../middleWares/authorization/auth");

const router = express.Router();



const logFunction = () => console.log();

//? createComment -- placeid alır -- delete ve edit comment id alır

//* create commentte place id alır -- diğerlerinde commentid
router.post("/commentplace/:id",[getAccessToRoute,logFunction],createComment);
router.put("/edit/:id",[getAccessToRoute,getCommentOwnerAccesToRoute,logFunction],editComment);
router.delete("/delete/:id",[getAccessToRoute,getCommentOwnerAccesToRoute,logFunction],deleteComment);
router.get("/show",showAll);
// comment id bu
router.post("/likecomment/:id",[getAccessToRoute,logFunction],likeComment)

module.exports = router;