const mongoose = require("mongoose");

const humdSchema = new mongoose.Schema(
	{
		value: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("humd", humdSchema);
