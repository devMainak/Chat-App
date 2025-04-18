require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const initializeDatabase = require("./config/db.connection");
const authRoutes = require("./routes/auth");
const { Server } = require("socket.io");
const Message = require("./models/message.model");
const User = require("./models/user.model");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(cors());
app.use(express.json());

initializeDatabase();

app.use("/auth", authRoutes);

// socket io logic
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("send_message", async (data) => {
    const { sender, receiver, message } = data;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
  });

  socket.broadcast.emit("receive_message", data);

  socket.on("disconnect", () => {
    console.log("User disconnect", socket.id);
  });
});

app.get("/messages", async (req, res) => {
  const { sender, receiver } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.get("/users", async (req, res) => {
  const { currentUser } = req.query;
  try {
    const users = await User.find({ username: { $ne: currentUser } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
