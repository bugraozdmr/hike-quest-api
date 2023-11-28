const express = require("express");
const router = express.Router();

const auth = require("./auth");

router.use("/", (req, res) => {
  res.json({
      message : "api access only for devs"
  });
});

router.use("/auth",auth);

module.exports = router;