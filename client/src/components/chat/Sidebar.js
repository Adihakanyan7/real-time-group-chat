import React from "react";
import "./sidebar.css";

const Sidebar = ({ onlineUsers, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? "➖" : "➕"}
      </button>
      <h3>Users Online ({onlineUsers.length})</h3>
      <ul>
        {onlineUsers.map((user, index) => (
          <li key={index}>{onlineUser === user.username ? "✅ You" : onlineUser}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
