const express = require("express");
const path = require("path");
const app = express();
const { ExpressPeerServer } = require("peer");

const server = app.listen(3000, () => {
  console.log("started at 3000 PORT...");
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static(path.join(__dirname, "")));

const io = require("socket.io")(server, {
  allowEIO3: true,
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});
