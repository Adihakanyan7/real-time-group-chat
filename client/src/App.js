import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect} from 'react';
import io from 'socket.io-client';
import "./style.css";

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {

    socket.on("load messages", (msgs) => {
      setMessages(msgs);
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
      socket.off("load messages");
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
    }
  };

    const sendMessage = (e) => {
      e.preventDefault();
      if (input.trim() && username) {
        socket.emit("chat message", { username, message: input });
        setInput("");
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
            <ul id="messages">
              {messages.map((msg, index) => (
                <li key={index}><strong>{msg.username}:</strong> {msg.message}</li>
              ))}
            </ul>
            <form id="form" onSubmit={sendMessage}>
              <input
                id="input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
