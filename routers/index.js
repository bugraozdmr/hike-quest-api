const express = require("express");
const router = express.Router();

const auth = require("./auth");
const places = require("./places");



router.use("/auth",auth);

router.use("/places",places);

router.use("/", (req, res) => {
  res.json({
      message : "api access only for devs"
  });
});


module.exports = router;