const express = require("express");
const router = express.Router();

const auth = require("./auth");
const places = require("./places");
const comment = require("./comment");



router.use("/auth",auth);

router.use("/places",places);

router.use("/comment",comment);

router.use("/kubmud",(req,res) => {
  const {KUBMUD_STR} = process.env;
  res.status(200).json({
    message : KUBMUD_STR
  });
});

// yukardakilere girmezse en alttaki çalışır
router.use("/", (req, res) => {
  res.json({
      message : "api access only for devs"
  });
});



module.exports = router;