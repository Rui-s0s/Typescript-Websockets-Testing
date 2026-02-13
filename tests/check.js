const { io } = require("socket.io-client");
const socket = io("http://localhost:4000");
const seen = new Set();

socket.emit("joinRoom", { username: "checker", room: "roomLoad" });

socket.on("newMessage", (msg) => {
  // Now msg.id actually exists!
  if (seen.has(msg.id)) {
    console.error(`🚨 REAL DUPLICATE DETECTED: ${msg.id}`);
  } else {
    seen.add(msg.id);
    // This count should match the total messages sent by Artillery
    console.log(`Unique Messages Received: ${seen.size}`);
  }
});