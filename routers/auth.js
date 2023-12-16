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


router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword",resetPassword);
router.post("/activate",activateAccount);

router.delete("/deleteuser",[getAccessToRoute,()=> console.log()],deleteUser);

//* dummy func yine -- art arda iki response olmaz
router.put("/edituser",[getAccessToRoute,()=> console.log()],editDetails);

router.get("/logout",[getAccessToRoute,()=> console.log()],logout);

module.exports = router;