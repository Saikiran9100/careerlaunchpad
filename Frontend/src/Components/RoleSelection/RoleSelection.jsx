import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const handleSelect = (role) => {
    setSelected(role);
    navigate(`/signup/${role}`);
  };

  return (
    <div className="start-container">
      <h1>Join as a client or freelancer</h1>
      <div className="options">
        <div
          className={`card ${selected === "client" ? "selected" : ""}`}
          onClick={() => handleSelect("client")}
        >
          <div className="circle">
            {selected === "client" && <div className="dot" />}
          </div>
          <p>I'm a client, hiring for a project</p>
        </div>

        <div
          className={`card ${selected === "freelancer" ? "selected" : ""}`}
          onClick={() => handleSelect("freelancer")}
        >
          <div className="circle">
            {selected === "freelancer" && <div className="dot" />}
          </div>
          <p>I'm a freelancer, looking for work</p>
        </div>
      </div>

      <p>
        Already have an account?{" "}
        <span className="login-link" onClick={() => navigate("/login")}>
          Log In
        </span>
      </p>
    </div>
  );
};

export default RoleSelection;