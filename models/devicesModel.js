const mongoose = require("mongoose");

const devicesSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
	},
	nameInProject: {
		type: String,
	},
	status: {
		type: String,
		enum: ["0", "1"],
	},
});

module.exports = mongoose.model("devices", devicesSchema);
