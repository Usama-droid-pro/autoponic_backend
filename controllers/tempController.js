const mongoose = require("mongoose");
const tempModel = require("../models/tempratureModel");
var format = require("date-fns/format");

exports.getTempReadings = async (req, res) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
	console.log("tempValues");
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);
	const temp = await tempModel.find({ createdAt: { $gte: today, $lt: tomorrow } });
	const count = await tempModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
	const temp2 = JSON.parse(JSON.stringify(temp));
	temp2.map((ele) => {
		ele.time2 = format(new Date(ele.createdAt), "hh:mm");
	});

	if (!temp) {
		throw new Error(204, "No Content");
	}
	res.status(200).json({ temp2, count });
};
