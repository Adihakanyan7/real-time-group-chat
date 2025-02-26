import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from "axios";

import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

import "./style.css";
import "./logout.css";

const socket = io('http://localhost:3000');

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);



  const [tempUsername, setTempUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);


  useEffect(() => {
    fetchUser();

    socket.on("load messages", (msgs) => {
      setMessages(msgs);
    });

    socket.on("chat cleared", () => {
      setMessages([]);  // ✅ Clear all messages in the frontend
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("typing update", (users) => {
      setTypingUsers(users);
    });

    socket.on("onlineUsers update", (users) => {
      setOnlineUsers(users);
    });

    socket.on("system message", (data) => {
      setMessages((prev) => [...prev, { username: data.username, message: data.message, timestamp: Date.now() }]);
    });


    return () => {
      socket.off("chat message");
      socket.off("load messages");
      socket.off("typing update");
      socket.off("onlineUsers update");
      socket.off("system message");
    };
  }, []);

  const handleSetUsername = () => {
    if (!user || !user.username) {
      setError("You must be logged in to join the chat.");
    } else {
      setError('');
      socket.emit("user joined", { username: user.username });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      setUser(null); // ✅ Remove user from state
    } catch (error) {
      console.log("Logout failed");
    }
  };


  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        withCredentials: true
      });
      setUser(response.data.user);
    } catch (error) {
      console.log("User not logged in");
    }
  };


  const handleTyping = () => {
    if (user && user.username) {
      socket.emit("user typing", { username: user.username });
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => {
        socket.emit("user stopped typing", { username: user.username });
      }, 2000));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (input.trim() === "/clear_chat_adi") {  // ✅ Detect secret command
      socket.emit("clear chat", "your-very-secret-key"); // ✅ Send secret key
      setInput("");
      return;
    }

    if (input.trim() && user.username) {
      socket.emit("chat message", { username: user.username, message: input });
      setInput("");
      socket.emit("user stopped typing", { username: user.username });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div>
      {user && <Navbar onLogout={handleLogout} />} {/* Show Navbar only if user is logged in */}
      <div className="main-content">
        {!user ? (
          <>
            {isRegistering ? (
              <Register onRegisterSuccess={setUser} />
            ) : (
              <Login onLogin={setUser} />
            )}
            <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: "pointer", color: "blue" }}>
              {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
            </p>

          </>
        ) : (
          <>
            <h2>Welcome, {user.username}!</h2>

            <button className="logout-btn" onClick={handleLogout}>Logout</button>

            <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
              <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? "➖" : "➕"}
              </button>
              <h3>Users Online ({onlineUsers.length})</h3>
              <ul>
                {onlineUsers.map((user, index) => (
                  <li key={index}>{user === user.username ? "✅ You" : user}</li>
                ))}
              </ul>
            </div>

            <ul id="messages">
              {messages.map((msg, index) => (
                <li key={index} className={msg.username === "System" ? "system-message" : ""}>
                  {msg.username !== "System" ?
                    (
                      <strong>{msg.username}<span className="timestamp">({formatTimestamp(msg.timestamp)})</span> : </strong>
                    )
                    : null}
                  {msg.message}
                </li>
              ))}
            </ul>

            <div id="typing-indicator" className={typingUsers.length > 0 ? "" : "hidden"}>
              {typingUsers.length > 0 && (
                <>
                  {typingUsers.slice(0, 2).join(", ")}
                  {typingUsers.length > 2 && (
                    <span title={typingUsers.slice(2).join(", ")}> and more...</span>
                  )} is typing...
                </>
              )}
            </div>
            <form id="form" onSubmit={sendMessage}>
              <input
                id="input"
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  handleTyping()
                }}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );

}

export default App;
