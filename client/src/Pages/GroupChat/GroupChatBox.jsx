// GroupChatBox.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "./GroupChatBox.css";

const GroupChatBox = ({ group }) => {
  const { userData } = useSelector((state) => state.user);
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Initialize socket connection
    socket.current = io("http://localhost:8800");

    // Join the group chat room
    socket.current.emit("join-group", group.data._id);

    // Listen for incoming messages for the group
    socket.current.on("receive-group-message", (data) => {
      if (data.groupId === group.data._id) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [group]);

  useEffect(() => {
    // Fetch initial messages for the group
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/message/${group.data._id}`);
        setMessages(res.data.message); // Initialize messages
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [group]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        chatId: group.data._id,
        isGroup: true,
        senderId: userData._id, // Set current user as sender
      };

      // Emit the message to the group chat via Socket.IO
      socket.current.emit("send-group-message", {
        groupId: group.data._id,
        message: messageData,
      });

      try {
        // Save the message to the backend
        const res = await axios.post(`http://localhost:3000/message`, messageData);
        setMessages((prev) => [...prev, res.data]); // Update state with the new message
        setNewMessage("");
      } catch (err) {
        console.log("Error sending message:", err);
      }
    }
  };

  return (
    <div className="group-chat-box">
      <div className="messages">
  {Array.isArray(messages) && messages.length > 0 ? (
    messages.map((msg) => (
      <div
        key={msg._id || `${msg.senderId}-${msg.createdAt}`} // Ensure unique key, fallback to combination of senderId and createdAt
        className={`message ${msg.senderId === userData._id ? "own" : ""}`}
      >
        <p>{msg.text}</p>
        <span>{msg.senderId}</span>
      </div>
    ))
  ) : (
    <p>No messages available</p>
  )}
</div>


      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GroupChatBox;
