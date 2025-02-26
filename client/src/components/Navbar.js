import React from "react";
import "./navbar.css";

const Navbar = ({ onLogout }) => {
  return (
    <div className="navbar">
      <h1>Group Chat</h1>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
