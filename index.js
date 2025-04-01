const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Queue = require("./queue");
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const waitingUsers = new Queue();

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  waitingUsers.enqueue(socket.id);

  console.log(waitingUsers)

  if (waitingUsers.size >= 2) {
    const user1 = waitingUsers.dequeue();
    const user2 = waitingUsers.dequeue();
    io.to(user1).emit("paired", user2);
    io.to(user2).emit("paired", user1);  
  }
  socket.on("offer", (offer, toSocketId) => {
    console.log(`Sending offer from ${socket.id} to ${toSocketId}`);
    io.to(toSocketId).emit("offer", offer, socket.id);  
  });

  socket.on("answer", (answer, toSocketId) => {
    console.log(`Sending answer from ${socket.id} to ${toSocketId}`);
    io.to(toSocketId).emit("answer", answer, socket.id);  
  });

  socket.on("ice-candidate", (candidate, toSocketId) => {
    console.log(`Sending ICE candidate from ${socket.id} to ${toSocketId}`);
    io.to(toSocketId).emit("ice-candidate", candidate, socket.id);  // Send ICE candidate
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(5000, () => {
  console.log("Server is running on port 5000");
});
