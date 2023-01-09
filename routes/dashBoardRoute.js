const express = require("express"),
router=express.Router();

const controller= require("../controllers/dashBoardController");

router.post("/updateDashBoard",controller.updateDashBoard)
router.get("/getDashBoard" , controller.getDashBoard)

module.exports=router