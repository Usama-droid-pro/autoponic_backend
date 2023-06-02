const mongoose = require("mongoose");
const deviceModel = require("../models/devicesModel");
const client = require("../socketAndMqtt");

client.publish("device2_status", "0");

exports.createDevice = async (req, res) => {
	try {
		const name = req.body.name;
		const status = req.body.status;
		const nameInProject = req.body.nameInProject;
		if (name == "") {
			return res.json({
				message: "name could not be empty",
				status: false,
			});
		}

		const foundName = await deviceModel.findOne({
			name: {
				$regex: "^" + name + "\\b",
				$options: "i",
			},
		});
		if (!foundName) {
			const device = await deviceModel({
				_id: mongoose.Types.ObjectId(),
				name: name,
				status: status,
				nameInProject: nameInProject,
			});

			const result = await device.save();

			if (result) {
				res.json({
					message: "New device has been created successfully",
					result: result,
					status: "success",
				});
			} else {
				res.json({
					message: "Could not create new device",
					status: "failed",
				});
			}
		} else {
			res.json({
				message: "This name already exists",
				status: false,
			});
		}
	} catch (err) {
		res.json({
			message: "Error creating device",
			error: err.message,
		});
	}
};

exports.getAllDevices = async (req, res) => {
	try {
		const result = await deviceModel.find({});
		if (result) {
			res.json({
				message: "Devices fetched",
				result: result,
				status: "success",
			});
		} else {
			res.json({
				message: "Could not fetch devices",
				status: "failed",
			});
		}
	} catch (err) {
		res.json({
			message: "Error fetching devices",
			error: err.message,
		});
	}
};
exports.changeStatus = async (req, res) => {
	try {
		console.log(req.params.id);
		const result = await deviceModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{ status: req.body.status },
			{ new: true }
		);
		console.log(result);
		if (!!result) {
			if (result.nameInProject === "device1") {
				client.publish("device1_status", req.body.status);
				res.status(200).send({ message: "updated", data: result });
			} else if (result.nameInProject === "device2") {
				client.publish("device2_status", req.body.status);
				res.status(200).send({ message: "updated", data: result });
			}
		} else {
			res.status(404).send({ message: "Device Not Found" });
		}
	} catch (e) {
		console.log(e);
		res.status(500).send({ message: e.message });
	}
};
exports.getDeviceById = async (req, res) => {
	try {
		const id = req.params.id;
		const result = await deviceModel.findOne({ _id: id });
		console.log("called", result);
		if (result) {
			res.status(200).send({
				message: "light fetched",
				success: true,
				result: result,
			});
		} else {
			res.json({
				message: "Could not fetch light",
				success: false,
			});
		}
	} catch (err) {
		res.json({
			message: "Error fetching ",
			error: err.message,
		});
	}
};

exports.deleteLight = async (req, res) => {
	try {
		const light_id = req.query.light_id;

		const result = await lightsModel.deleteOne({ _id: light_id });

		if (result.deletedCount > 0) {
			res.json({
				message: "Deleted",
				result: result,
			});
		} else {
			res.json({
				message: "could not deleted",
				status: "failed",
			});
		}
	} catch (err) {
		res.json({
			message: "Error",
			error: err.message,
		});
	}
};

exports.updateLight = async (req, res) => {
	try {
		const name = req.body.name;
		const status = req.body.status;

		var result = await lightsModel.findOneAndUpdate(
			{ name: name },
			{ status: status },
			{ new: true }
		);

		if (result) {
			res.json({
				message: "light updated successfully",
				result: result,
				status: "success",
			});
		} else {
			res.json({
				message: "could not updated",
				result: null,
				status: "false",
			});
		}
	} catch (err) {
		res.json({
			message: "error",
			error: err.message,
		});
	}
};
