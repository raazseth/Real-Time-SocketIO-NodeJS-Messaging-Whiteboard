const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { sequelize } = require("./Configs/db");
const { v4: uuidv4 } = require("uuid");
const app = express();

const server = http.createServer(app);
const io = socketIo(server);
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Establishing socket connection
io.on("connection", (socket) => {
  socket.on("create-session", (name) => {
    const sessionId = uuidv4();
    socket.join(sessionId);
    socket.emit("session-created", sessionId, name);
  });

  socket.on("join-session", (data) => {
    socket.join(data.id);
    socket.emit("session-joined", data);
  });


  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("color-change", (data) => {
    socket.to(data.sessionId).emit("color-change", data);
  });

  socket.on("clear", (sessionId) => {
    socket.to(sessionId).emit("clear");
  });

  socket.on("leave-session", (sessionId) => {
    socket.leave(sessionId);
    socket.emit("session-left", sessionId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Connect to the PostgreSQL database
sequelize.authenticate().then(async () => {
  sequelize
    .sync({ force: true })
    .then(async () => {
      console.log("All models were synchronized successfully.");
    })
    .catch((err) => {
      console.error(err);
    });
});

const userRoutes = require("./Routes/userRoutes");

app.use("/api", userRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
