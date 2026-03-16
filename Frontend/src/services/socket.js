import { io } from "socket.io-client";

const socket = io("https://innobridge-backend.onrender.com", { transports: ["websocket"],
});

export default socket;