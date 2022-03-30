import React from "react";
import Avatar from "react-avatar";

const Client = ({ userName }) => {
  console.log({ userName });
  return (
    <div className="client" style={{ width: "52px" }}>
      <Avatar
        style={{ margin: "62px" }}
        name={userName}
        size={50}
        round="14px"
      />
      <span className="userName">{userName}</span>
      {/* <span className="userName">{userName}</span> */}
    </div>
  );
};

export default Client;
