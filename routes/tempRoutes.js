const express = require("express");
const router = express.Router();
const controller = require("../controllers/tempController");

router.get("/getTempReadings", controller.getTempReadings);
module.exports = router;
