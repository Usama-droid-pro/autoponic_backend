const mongoose = require("mongoose");

const moisture = new mongoose.Schema(
	{
		value: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("moisture", moisture);
