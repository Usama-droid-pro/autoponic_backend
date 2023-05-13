const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mqtt = require("mqtt");
const temp = require("./models/tempratureModel");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const client = mqtt.connect("mqtt://91.121.93.94");
const PORT = 3000;
mongoose.set("strictQuery", false);

// const userLogsModel= require('./models/userLogsModels')

const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	cors({
		methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	})
);

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

app.use("/user", require("./routes/userRoute"));
app.use("/admin", require("./routes/adminRoute"));
app.use("/forgetPassword", require("./routes/userForgetRoute"));
app.use("/dashBoard", require("./routes/dashBoardRoute"));
app.use("/lights", require("./routes/lightsRoute"));
app.use("/temp", require("./routes/tempRoutes"));

client.on("connect", function () {
	client.subscribe("device_hasnat_temp", function (err) {
		if (!err) {
			client.publish("device/led", "Hello mqtt hasnat");
		}
	});
	client.subscribe("device_hasnat_humd", function (err) {
		if (!err) {
			client.publish("device/led", "Hello mqtt hasnat");
		}
	});
});
let count = 0;

io.on("connection", (socket) => {
	console.log(socket.id);

	client.on("message", async function (topic, message) {
		// message is Buffer
		console.log(topic);
		console.log(message.toString());
		count++;
		if (topic === "device_hasnat_temp") {
			socket.emit("temp", message.toString());
		} else if (topic === "device_hasnat_humd") {
			socket.emit("humd", message.toString());
		}
		// socket.emit("humd", message.toString());
		// await temp.deleteMany();
		if (count === 60) {
			try {
				console.log("called");
				await temp.create({ value: message.toString() });
				count = 0;
			} catch (e) {
				count = 0;
				console.log(e);
			}
		}

		// client.publish("device/led", "Hello mqtt hasnat checking");
	});

	console.log("a user connected");
	socket.emit("message", "hi How are you");
	socket.on("message2", (data) => {
		console.log(data);
		client.publish("inTopic", data);
	});
	socket.on("message3", (data) => {
		console.log(data);
		client.publish("inTopic", data);
	});
	socket.on("data", (data) => {
		console.log(data);
	});
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

const port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log("server started on port " + port);
});
