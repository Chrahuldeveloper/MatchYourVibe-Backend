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

  socket.on("registerPeer", (peerId) => {
    console.log(`User registered with Peer ID: ${peerId}`);

    waitingUsers.enqueue({ socketId: socket.id, peerId });

    if (waitingUsers.size() >= 2) {
      const user1 = waitingUsers.dequeue();
      const user2 = waitingUsers.dequeue();

      console.log(`Matching ${user1.peerId} with ${user2.peerId}`);

      io.to(user1.socketId).emit("matchFound", { peerId: user2.peerId });
      io.to(user2.socketId).emit("matchFound", { peerId: user1.peerId });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    let updatedQueue = new Queue();
    while (!waitingUsers.isEmpty()) {
      let user = waitingUsers.dequeue();
      if (user.socketId !== socket.id) {
        updatedQueue.enqueue(user);
      }
    }
    waitingUsers.items = updatedQueue.items; 

    socket.broadcast.emit("callEnded");
  });
});

httpServer.listen(5000, () => {
  console.log("Server is running on port 5000");
});
