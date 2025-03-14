import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./chat.css";

const socket = io("http://localhost:3000");

const Chat = ({ user, messages, input, setInput, sendMessage, typingUsers, handleTyping, formatTimestamp }) => {

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("typing update", (users) => {
      setTypingUsers(users);
    });

    return () => {
      socket.off("chat message");
      socket.off("typing update");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && user.username) {
      socket.emit("chat message", { username: user.username, message: input });
      setInput("");
      socket.emit("user stopped typing", { username: user.username });
    }
  };

  return (
    <div className="chat-container">
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
    </div>
  );
};

export default Chat;
