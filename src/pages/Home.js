import React, { useState } from "react";
import classes from "./Home.module.css";
import image from "../pages/code-sync.png";
import Footer from "./Footer";
import Toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [RoomId, setRoomId] = useState();
  const [userName, setUserName] = useState();
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    console.log(id);
    setRoomId(id);
    Toast.success("Successfully created room");
  };

  const joinRoom = () => {
    if (!RoomId || !userName) {
      Toast.error("userName & RoomId is Required");
      return;
    } else {
      navigate(`/editor:${RoomId}`, {
        state: {
          userName,
        },
      });
    }
  };

  const HandleEnterKey = (e) => {
    console.log("event", e.code);
    // e.preventDefault(); // if i dont want any event so set this e.preventDefault
    if (e.code === "Enter") {
      joinRoom();
    } else {
      console.log("jhsdfgsdh");
    }
  };
  return (
    <>
      <div className={classes.Home}>
        <form>
          <img src={image} alt="upali"></img>
          <h3 style={{ color: "white" }}>Paste Invitation Room Id</h3>
          <input
            type="text"
            value={RoomId}
            onChange={(e) => setRoomId(e.target.value)} //if anyone wants to add roomId manually
            placeholder="ROOM ID"
            onKeyUp={HandleEnterKey}
          />
          <input
            placeholder="USERNAME"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyUp={HandleEnterKey}
          />
          <button
            onClick={joinRoom}
            style={{
              backgroundColor: "#4aed88",
              height: "33px",
              width: "67px",
              margin: "22px",
              borderRadius: "9px",
            }}
          >
            Join
          </button>
          <h4 style={{ color: "white" }}>
            If you dont have an invite then Create{" "}
            <a
              href="www.com"
              onClick={createNewRoom}
              style={{ color: "#4aed88", textDecorationLine: "underline" }}
            >
              New room
            </a>
          </h4>
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
