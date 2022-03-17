import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

socket.connect();

socket.on("connect", function () {
  console.log("connected to localhost:3000");
});

// receive emitted count messages from server
socket.on("clientEvent", function (data) {
  console.log(data);
});
