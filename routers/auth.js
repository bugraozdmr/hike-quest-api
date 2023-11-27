const express = require("express");

const {
    register ,
    getUser,
    login,
    logout,
    editDetails
} = require("../controllers/auth");

const {getAccessToRoute} = require("../middleWares/authorization/auth");

const router = express.Router();

router.get("/",(req,res) => {
    res.send("Auth home page");
});

router.post("/register",register);
router.get("/profile",getAccessToRoute,getUser);
router.post("/login",login);
// getAccessToRouter login olmuşmuyuz durumunu kontrol eder
router.get("/logout",getAccessToRoute,logout);

//* dummy func yine -- art arda iki response olmaz
router.put("/edit",[getAccessToRoute,()=> console.log()],editDetails);

module.exports = router;