const mongoose = require("mongoose");

const tempSchema = new mongoose.Schema(
	{
		value: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("temp", tempSchema);
