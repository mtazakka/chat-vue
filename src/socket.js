import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
