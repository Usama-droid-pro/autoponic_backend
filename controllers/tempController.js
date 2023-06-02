const mongoose = require("mongoose");
const tempModel = require("../models/tempratureModel");

exports.getTempReadings = async (req, res) => {
	const temp = await tempModel
		.find()
		.limit(10)
		.skip(10 * req.params.num);

	if (!temp) {
		throw new Error(204, "No Content");
	}
	res.status(200).json(temp);
};
