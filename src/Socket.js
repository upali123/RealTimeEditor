import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "infinity",
    timout: "1000",
    transports: ["websocket"],
  };
  return io(process.env.REACT_APP_BACKEND_URL, options);
};
