import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import ACTIONS from "../Actions";
import { initSocket } from "../Socket";
import image from "./code-sync.png";
import Client from "./components/Client";
import Editor from "./components/Editor";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const EditorPage = () => {
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  // console.log({ param });

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connection failed", (err) => handleErrors(err));
      socketRef.current.on("connection failed", (err) => handleErrors(err));

      const handleErrors = (e) => {
        console.log("socket error", e);
        toast.error("secure connection failed,Please try again later");
        reactNavigator("/");
      };
      console.log("upali is here", socketRef);
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName, //location is used here
      });
      // console.log("jhdsjkahd", ACTIONS.JOIN);
      //listening for joined event

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      // socketRef.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      //   io.to(roomId).emit(ACTIONS.CODE_CHANGE, {
      //     code,
      //   });
      // });
      //listening for disconnected

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left the room  `);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);
  async function copyFunc() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("successfully copied on clipboard");
      // console.log(copyFunc);
    } catch (err) {
      toast.error("no copied");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="MainWrapper">
      <div className="aside">
        <div className="aside-inner">
          <div className="logo">
            <img className="logoImage" src={image} />
          </div>
          <h3 style={{ color: "white" }}>Connected</h3>
          <div className="clients">
            {clients.map((client) => (
              <Client key={client.socketId} userName={client.userName} />
            ))}
          </div>
        </div>
        <button
          className="btn-success"
          style={{
            width: "82px",
            marginTop: "15rem",
            color: "white",
            backgroundColor: "green",
          }}
          onClick={leaveRoom}
        >
          LeaveRoom
        </button>
        <button
          style={{
            width: "82px",
            margin: "28px",
            // marginTop: "22rem",
            color: "white",
            backgroundColor: "green",
          }}
          className="btn-primary"
          onClick={copyFunc}
        >
          Copy ID
        </button>
      </div>
      <div className="editor" style={{ float: "right", color: "white" }}>
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
