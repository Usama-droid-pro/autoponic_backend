const mongoose = require("mongoose");
const tempModel = require("../models/tempratureModel");
const humidityModel = require('../models/humidityModel')
var format = require("date-fns/format");

exports.getTempReadings = async (req, res) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
	console.log("tempValues");
	let tomorrow = new Date(today);
	
	tomorrow.setDate(today.getDate() + 1);
	const temp = await tempModel.find({ createdAt: { $gte: today, $lt: tomorrow } });
	const count = await tempModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
	const temp2 = JSON.parse(JSON.stringify(temp));




	temp2.map((ele) => {
		ele.time2 = format(new Date(ele.createdAt), "hh:mm a");
	});
	
	if (!temp) {
		throw new Error(204, "No Content");
	}
	res.status(200).json({ temp2, count });
};

exports.getMoistureValue = async (req, res) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
	console.log("tempValues");
	let tomorrow = new Date(today);
	
	tomorrow.setDate(today.getDate() + 1);
	const temp = await tempModel.find({ createdAt: { $gte: today, $lt: tomorrow } });
	const count = await tempModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
	const temp2 = JSON.parse(JSON.stringify(temp));




	temp2.map((ele) => {
		ele.time2 = format(new Date(ele.createdAt), "hh:mm a");
	});
	
	if (!temp) {
		throw new Error(204, "No Content");
	}
	res.status(200).json({ temp2, count });
};


exports.getTempGraph = async (req, res) => {
	const today = new Date();

	today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
	console.log("tempValues");
	let tomorrow = new Date(today);
	
	tomorrow.setDate(today.getDate() + 1);
	const temp = await tempModel.find({ createdAt: { $gte: today, $lt: tomorrow } });
	const count = await tempModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
	const temp2 = JSON.parse(JSON.stringify(temp));


	temp2.map((ele) => {
		ele.time2 = format(new Date(ele.createdAt), "hh:mm a");
	});

	const result = await fetchThreeHourIntervals(temp2);

	console.log(result)
	
	if (!result) {
		throw new Error(204, "No Content");
	}
	res.status(200).json({ result, count });
};


async function fetchThreeHourIntervals(records) {
	const intervals = {};
	let intervalEnd;
	// Iterate over each record
	records.forEach(record => {
	  // Extract the hour and period (AM/PM) from the time2 field
	  const [time, period] = record.time2.split(' ');
	  const [hour, minutes] = time.split(':');
	  
	  // Convert the hour to 24-hour format
	  let hour24 = parseInt(hour, 10);
	  if (period === 'PM' && hour24 !== 12) {
		hour24 += 12;
	  } else if (period === 'AM' && hour24 === 12) {
		hour24 = 0;
	  }
	  
	  // Calculate the interval for the record
	  const intervalStart = Math.floor(hour24 / 3) * 3;
	   intervalEnd = (intervalStart + 3) % 24;
	  
	  // Create the interval key if it doesn't exist
	  if (!intervals[intervalStart]) {
		intervals[intervalStart] = {
		  count: 0,
		  sum: 0,
		};
	  }
	  
	  // Add the temperature to the interval
	  intervals[intervalStart].sum += record.value;
	  intervals[intervalStart].count++;
	});
	
	// Calculate the average for each interval
	const averages = {};
	for (let i = 0; i < 24; i += 3) {
	  const intervalStart = i;
	  const intervalEnd = (i + 3) % 24;
	  const intervalKey = `${intervalStart}:00 ${intervalStart < 12 ? 'AM' : 'PM'} - ${intervalEnd}:00 ${intervalEnd < 12 ? 'AM' : 'PM'}`;
	  if (intervals[intervalStart]) {
		averages[intervalKey] = intervals[intervalStart].sum / intervals[intervalStart].count;
	  } else {
		averages[intervalKey] = 0;
	  }
	}
	
	return averages;
  }
  
  exports.getHumidityReadings = async (req, res) => {
	const today = new Date();

	today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
	console.log("tempValues");
	let tomorrow = new Date(today);
	
	tomorrow.setDate(today.getDate() + 1);
	const humid = await humidityModel.find({ createdAt: { $gte: today, $lt: tomorrow } });
	// const humid= await humidityModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
	const humid2 = JSON.parse(JSON.stringify(humid));




	humid2.map((ele) => {
		ele.time2 = format(new Date(ele.createdAt), "hh:mm a");
	});
	
	if (!humid) {
		throw new Error(204, "No Content");
	}
	res.status(200).json({ humid2 });
};

exports.humidityGraph = async (req, res) => {
	const today = new Date();

	today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
	console.log("tempValues");
	let tomorrow = new Date(today);
	
	tomorrow.setDate(today.getDate() + 1);
	const humid = await humidityModel.find({ createdAt: { $gte: today, $lt: tomorrow } });
	// const humid= await humidityModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
	const humid2 = JSON.parse(JSON.stringify(humid));




	humid2.map((ele) => {
		ele.time2 = format(new Date(ele.createdAt), "hh:mm a");
	});

	const result = await fetchThreeHourIntervals(humid2);
	console.log(result)
	
	if (!result) {
		throw new Error(204, "No Content");
	}
	res.status(200).json({ result });
};