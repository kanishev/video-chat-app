const express = require("express");
const path = require("path");
const app = express();
const server = app.listen(3000, () => {
  console.log("started at 3000 PORT...");
});

const io = require("socket.io")(server, {
  allowEIO3: true, // false by default
});
app.use(express.static(path.join(__dirname, "")));

io.on("connection", (socket) => {
  console.log("socket id is", socket.id);
});
