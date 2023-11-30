const express = require("express");
const router = express.Router();

const auth = require("./auth");



router.use("/auth",auth);

router.use("/", (req, res) => {
  res.json({
      message : "api access only for devs"
  });
});


module.exports = router;