const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mqtt = require("mqtt");
const temp = require("./models/tempratureModel");
const app = express();
const http = require("http");
const server = http.createServer(app);
const device = require("./models/devicesModel");
const { Server } = require("socket.io");
const humd = require("./models/humidityModel");
const io = new Server(server);
// const client = mqtt.connect("mqtt://91.121.93.94");
const client = require("./socketAndMqtt");
const PORT = 3000;
mongoose.set("strictQuery", false);

// const userLogsModel= require('./models/userLogsModels')

const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors("*"));

require("dotenv").config();

//connect to db
mongoose.connect(
	process.env.DB_CONNECTION,
	{
		useUnifiedTopology: true,
		useNewUrlParser: true,
	},
	() => console.log("Connected to DB")
);

//middleware
app.use(express.json());

//routes
app.get("/", (req, res) => {
	res.json({ message: "Server Is In Running State" });
});
app.use("/user", require("./routes/userRoute"));
app.use("/admin", require("./routes/adminRoute"));
app.use("/forgetPassword", require("./routes/userForgetRoute"));
app.use("/dashBoard", require("./routes/dashBoardRoute"));
app.use("/devices", require("./routes/deviceRoute"));
app.use("/temp", require("./routes/tempRoutes"));

client.on("connect", function () {
	console.log("on Connect Called");
	client.subscribe("device_hasnat_temp", function (err) {
		if (!err) {
			// client.publish("device/led", "Hello mqtt hasnat");
		}
	});
	client.subscribe("device_hasnat_humd", function (err) {
		if (!err) {
			// client.publish("device/led", "Hello mqtt hasnat");
		}
	});
	client.subscribe("outTopic_hasnat", function (err) {
		if (!err) {
			// client.publish("device/led", "Hello mqtt hasnat");
		}
	});
	client.subscribe("previous_state", function (err) {
		if (!err) {
			client.publish("device/led", "Hello mqtt hasnat");
		}
	});
});
let count = 0;
// let value = "1";

client.on("message", async function (topic, message) {
	console.log(topic);
	console.log(message.toString());
	count++;
	if (topic === "previous_state") {
		console.log("previous state");
		// console.log(value);
		const result = await device.find().sort({ nameInProject: "asc" });
		console.log(result);
		if (!result) {
		} else {
			if (result[0].nameInProject === "device1") {
				client.publish("previous_state_recieved_device1", result[0].status);
			}
			if (result[1].nameInProject === "device2") {
				client.publish("previous_state_recieved_device2", result[1].status);
			}
		}
	}

	// if (count === 5) {
	if (topic === "device_hasnat_humd") {
		try {
			const record = await humd.findOne().sort({ createdAt: -1 });
			const time = record.createdAt;
			const currentTime = new Date();
			const diff = currentTime.getTime() - time.getTime();
			const mins = diff / 90000;
			// console.log("time", time);
			// console.log("currenttime", currentTime);
			// console.log("diff", diff);
			// console.log("mins", mins);
			if (mins > 5) {
				console.log("called2");
				await humd.create({ value: message.toString() });
			}
			// await humd.create({value})
			// count = 0;
		} catch (e) {
			count = 0;
			console.log(e);
		}
	} else if (topic === "device_hasnat_temp") {
		try {
			const record = await temp.findOne().sort({ createdAt: -1 });
			const time = record.createdAt;
			const currentTime = new Date();
			const diff = currentTime.getTime() - time.getTime();
			const mins = diff / 90000;
			if (mins > 5) {
				console.log("called1");
				await temp.create({ value: message.toString() });
				// await humd.create({value})
			}
			count = 0;
		} catch (e) {
			count = 0;
			console.log(e);
		}
		// }
	}
});

io.on("connection", (socket) => {
	console.log(socket.id);

	client.on("message", async function (topic, message) {
		// message is Buffer

		if (topic === "device_hasnat_temp") {
			// console.log("dsdsda");
			// console.log(topic);
			// console.log(message.toString());
			socket.emit("temp", message.toString());
		}
		if (topic === "device_hasnat_humd") {
			// console.log("dsdsda");
			// console.log(topic);
			// console.log(message.toString());

			socket.emit("humd", message.toString());
		}

		//dfdsfads
		// socket.emit("humd", message.toString());
		// await temp.deleteMany();

		client.publish("device/led", "Hello mqtt hasnat checking");
	});

	console.log("a user connected");
	// socket.emit("message", "hi How are you");
	// socket.on("message2", (data) => {
	// 	value=data;
	// 	console.log(value);
	// 	client.publish("inTopic_hasnat", data);
	// });
	// socket.on("message3", (data) => {
	// 	value=data;
	// 	console.log(value);
	// 	client.publish("inTopic_hasnat", data);
	// });
	// socket.on("data", (data) => {
	// 	console.log(data);
	// });
});

// //
// app.post("/user/logout",(req,res)=>
// {
//   const userId= req.body.userId;

//   const userLog= new userLogsModel({
//     _id:mongoose.Types.ObjectId(),
//     user_id:userId,
//     ip:req.body.ip,
//     country:req.body.country,
//     logType:"logout"
//   })

//   userLog.save(function(err,result){
//     if(result){
//       res.json({
//         message: "user Logout record maintained",
//         result:result,
//         message: "after calling this api delete user jwt token stored in cookies ,local storage from front end"
//       })
//     }
//     else{
//       console.log("Error in saving logs")
//     }
//   })

// })

// const cloudinary = require("./utils/cloudinary")

const port = process.env.PORT || 8000;

server.listen(port, function () {
	console.log("server started on port " + port);
});

// module.exports {client}
