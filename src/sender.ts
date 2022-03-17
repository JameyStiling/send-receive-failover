import { Server } from "socket.io";

const io = new Server(3000);
let [countArg, nodeID] = process.argv.slice(2)
let count = parseInt(countArg) || 0;

io.on("connection", function (socket) {
  console.log("connected:");

  setInterval(function () {
    socket.emit("clientEvent", {
      count: count, // 0,1,2,3,4 ...
      appID: "Sender",
      nodeID: nodeID || 'Main',
    });
    count++;
    // arbitrary error to demonstrate app interruption
    if (count === 10) {
      throw new Error();
    }

  }, 1000);
});

const hanndleAppErrors = (error) => {
  process.send({
    type: "process:msg",
    data: {
      count,
    },
  });
};

// io.on("connect_failed", hanndleAppErrors);
// io.on("error", hanndleAppErrors);
// io.on("disconnect", hanndleAppErrors);

process.on("uncaughtException", hanndleAppErrors);
