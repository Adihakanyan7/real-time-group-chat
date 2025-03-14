import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from "axios";

import Chat from "./components/chat/Chat";
import Sidebar from "./components/chat/Sidebar";
import AuthContainer from "./components/auth/AuthContainer";


import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Navbar from "./components/layout/Navbar";

import "./style.css";
import "./logout.css";

const socket = io('http://localhost:3000');

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

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
          <AuthContainer onAuthSuccess={setUser} />
        ) : (
          <>
            <h2>Welcome, {user.username}!</h2>
            <Sidebar onlineUsers={onlineUsers} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Chat user={user} messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} typingUsers={typingUsers} handleTyping={handleTyping} formatTimestamp={formatTimestamp} />
          </>
        )}
      </div>
    </div>
  );

}

export default App;
