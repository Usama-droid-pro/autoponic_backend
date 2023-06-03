const express = require("express");
const router = express.Router();
const controller = require("../controllers/tempController");

router.get("/getTempReadings", controller.getTempReadings);
router.get("/getTempGraph", controller.getTempGraph);

router.get("/getHumidityReadings", controller.getHumidityReadings);
router.get("/humidityGraph", controller.humidityGraph);

router.get("/getMoistureValue", controller.getMoistureValue);
router.get("/getMoistureGraph", controller.getMoistureGraph);
module.exports = router;
