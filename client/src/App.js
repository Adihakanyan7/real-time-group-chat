import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./style.css";

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);


  useEffect(() => {
    socket.on("load messages", (msgs) => {
      setMessages(msgs);
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

    return () => {
      socket.off("chat message");
      socket.off("load messages");
      socket.off("typing update");
      socket.off("onlineUsers update");
    };
  }, []);

  const handleSetUsername = () => {
    if (tempUsername.trim().length === 0) {
      setError('Nickname cannot be empty');
    } else if (tempUsername.trim().length > 20) {
      setError('Nickname cannot be longer than 20 characters');
    } else {
      setUsername(tempUsername.trim());
      setError('');
      socket.emit("user joined", { username: tempUsername.trim() });
    }
  };

  const handleTyping = () => {
    if (username) {
      socket.emit("user typing", { username });
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => {
        socket.emit("user stopped typing", { username });
      }, 2000));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && username) {
      socket.emit("chat message", { username, message: input });
      setInput("");
      socket.emit("user stopped typing", { username });
    }
  };

  return (
    <div>
      {!username ? (
        <div className="username-container">
          <h2>Enter Your Nickname</h2>
          <input
            type="text"
            maxLength={20}
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            placeholder='Nickname (max 20 characters)'
          />
          <button onClick={handleSetUsername}>Join Chat</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <>
          <h2>Welcome, {username}!</h2>

          <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? "➖" : "➕"}
            </button>
            <h3>Users Online ({onlineUsers.length})</h3>
            <ul>
              {onlineUsers.map((user, index) => (
                <li key={index}>{user === username ? "✅ You" : user}</li>
              ))}
            </ul>
          </div>

          <ul id="messages">
            {messages.map((msg, index) => (
              <li key={index}><strong>{msg.username}:</strong> {msg.message}</li>
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
  );

}

export default App;
