import { io } from "socket.io-client";

const socket = io("https://idea-incubator-production.up.railway.app", {  transports: ["websocket"],
});

export default socket;