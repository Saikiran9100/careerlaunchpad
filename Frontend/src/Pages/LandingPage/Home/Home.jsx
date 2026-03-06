import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
const Home = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        fontFamily: "var(--font-family)",
      }}
    >
      <h1>Welcome to CareerLaunchPad!</h1>
      <p>You have successfully logged in or signed up.</p>
      <Link to="/" style={{ color: "var(--primary-blue)" }}>
        Go back to Landing Page
      </Link>
    </div>
  );
};

export default Home;