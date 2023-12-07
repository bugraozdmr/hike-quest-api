const express = require("express");

const {
    register ,
    getAllUser,
    login,
    logout,
    editDetails,
    forgotPassword,
    resetPassword,
    activateAccount,
    deleteUser
} = require("../controllers/auth");

const {getAccessToRoute} = require("../middleWares/authorization/auth");

const router = express.Router();

router.get("/",(req,res) => {
    res.send("Auth home page");
});

router.post("/register",register);
//todo auth iste erişim isteği için
router.get("/getAllUser",getAllUser);
router.post("/login",login);
// getAccessToRouter login olmuşmuyuz durumunu kontrol eder
router.get("/logout",getAccessToRoute,logout);

router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword",resetPassword);
router.post("/activate",activateAccount);

router.delete("/deleteuser",[getAccessToRoute,()=> console.log()],deleteUser);

//* dummy func yine -- art arda iki response olmaz
router.put("/edit",[getAccessToRoute,()=> console.log()],editDetails);

module.exports = router;