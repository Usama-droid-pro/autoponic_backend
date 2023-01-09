
const express = require('express');
const router = express.Router();
const controller = require("../controllers/lightController")

router.post("/createLight" ,controller.createLight)
router.get("/getAllLight" , controller.getAllLights)
router.get("/getLightById" , controller.getLightById)

router.put("/updateLight", controller.updateLight)
router.delete("/deleteLight", controller.deleteLight)

module.exports= router;