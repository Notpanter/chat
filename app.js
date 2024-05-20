require("dotenv").config();

var mongoose = require("mongoose");
const url = "mongodb+srv://kambardias4:admin789@cluster0.tfpxkjo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(url);

const app = require("express")();

const http = require("http").Server(app);

const userRoute = require("./routes/userRoute");
const User = require("./models/userModel");
const Chat = require("./models/chatModel");

app.use("/", userRoute);

const io = require("socket.io")(http);

var usp = io.of("/user-namespace");

usp.on("connection", async function (socket) {
  console.log("User connected");

  var userId = socket.handshake.auth.token;

  await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: "1" } });

  //User broadcast online status
  socket.broadcast.emit("getOnlineUser", { user_id: userId });

  socket.on("disconnect", async function () {
    console.log("User disconnected");

    var userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: "0" } });

    //User broadcast offline status
    socket.broadcast.emit("getOfflineUser", { user_id: userId });
  });

  //chatting implementation
  socket.on("newChat", function (data) {
    socket.broadcast.emit("loadNewChat", data);
  });

  //load old chats
  socket.on("existsChat", async function (data) {
    var chats = await Chat.find({
      $or: [
        { sender_id: data.sender_id, receiver_id: data.receiver_id },
        { sender_id: data.receiver_id, receiver_id: data.sender_id },
      ]
    });
    socket.emit("loadChats", { chats: chats });
  });
});

http.listen(4000, function () {
  console.log("4000 server is runing");
});