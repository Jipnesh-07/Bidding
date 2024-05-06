const { closeBid, getBid, startBid, updateBid, getAllBids } = require("./bid.controllers.js");

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
// const server = http.createServer(app);
// const io = new socketIo(server, {
// 	cors: {
// 		origin: "*",
// 	},
// });
app.use(express.json({ limit: "50kb" }))
app.use(express.urlencoded({ extended: true, limit: "50kb" }))
app.use(express.static("public"))

// app.use(cookieParser())

// cors
app.use(cors());

mongoose.connect(
	"mongodb+srv://Ansh:iZbKKbr8Sq6mgbsh@ceed-databse-events.7zoqyvb.mongodb.net/socket"
)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB", err));

app.get("/", (req, res) => {
	res.json({}).status(200);
})

// const messageSchema = new mongoose.Schema({
// 	room: String,
// 	user: String,
// 	text: String,
// 	createdAt: { type: Date, default: Date.now },
// });

// const Message = mongoose.model("Message", messageSchema);

// const rooms = new Set(["New Room"]);

// io.on("connection", (socket) => {
// 	console.log("New client connected");

// 	io.emit("updateRooms", Array.from(rooms));

// 	socket.on("createRoom", (roomName) => {
// 		rooms.add(roomName);
// 		io.emit("updateRooms", Array.from(rooms));
// 	});

// 	socket.on("joinRoom", (roomName) => {
// 		socket.join(roomName);
// 		socket.room = roomName;
// 	});

// 	socket.on("sendMessage", async (message) => {
// 		const { user, text } = message;
// 		console.log(`Received message from ${user}: ${text}`);
// 		const newMessage = new Message({ room: socket.room, user, text });
// 		await newMessage.save();
// 		io.to(socket.room).emit("message", {
// 			room: newMessage.room,
// 			user: newMessage.user,
// 			text: newMessage.text,
// 			createdAt: newMessage.createdAt
// 		});
// 	});

// 	socket.on("disconnect", () => {
// 		console.log("Client disconnected");
// 	});
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});


app.route("/bid").get(getBid)
	.post(startBid)
	.put(updateBid)
	.delete(closeBid)
app.get("/allBids",getAllBids)