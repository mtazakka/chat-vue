import { io } from "socket.io-client";

const URL = "http://18.141.111.48:3000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
