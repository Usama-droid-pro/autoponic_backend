const express = require("express");
const router = express.Router();
const controller = require("../controllers/deviceController");

router.post("/createDevice", controller.createDevice);
router.get("/getAllDevices", controller.getAllDevices);
router.get("/getDeviceById/:id", controller.getDeviceById);

router.put("/updateLight", controller.updateLight);
router.delete("/deleteLight", controller.deleteLight);
router.put("/changeStatus/:id", controller.changeStatus);
router.put("/automatic/:id", controller.automaic);

module.exports = router;
