const express = require("express");
const router = express.Router();

const auth = require("./auth");

router.use("/", (req, res) => {
    res.json({
        message : "mal eup"
    });
  });

router.use("/auth",auth);

module.exports = router;