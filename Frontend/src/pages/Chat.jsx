import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import socket from "../services/socket";

export default function Chat({ userId }) {
  const myId = localStorage.getItem("userId");
  const otherUserId = userId;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const bottomRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [isOnline, setIsOnline] = useState(false);

  // ---------------- LOAD CHAT HISTORY ----------------
  useEffect(() => {
    if (!otherUserId) return;

    api.get(`/chat/${otherUserId}`)
      .then(res => {
        setMessages(res.data.messages || []);
        setOtherUser(res.data.otherUser?.name || "");
        socket.emit("markSeen", {
          senderId: String(otherUserId),
          receiverId: String(myId)
        });
        socket.emit("checkOnline", { userId: otherUserId });
      })
      .catch(() => toast.error("Failed to load chat"));

  }, [otherUserId]);

  // ---------------- RECEIVE MESSAGE ----------------
  useEffect(() => {
    if (!myId) return;

    const handleReceive = (msg) => {
      const isSameConversation =
        (String(msg.sender_id) === String(otherUserId) && String(msg.receiver_id) === String(myId)) ||
        (String(msg.sender_id) === String(myId) && String(msg.receiver_id) === String(otherUserId));

      if (!isSameConversation) return;

      setMessages(prev => {
        if (prev.some(m => m.message_id === msg.message_id)) return prev;
        return [...prev, msg];
      });

      if (String(msg.receiver_id) === String(myId)) {
        socket.emit("markSeen", {
          senderId: msg.sender_id,
          receiverId: msg.receiver_id
        });
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);

  }, [otherUserId, myId]);

  // ---------------- LISTEN FOR SEEN UPDATE ----------------
  useEffect(() => {
    const handleSeen = ({ sender_id, receiver_id }) => {
      setMessages(prev => [...prev.map(msg => {
        if (
          String(msg.sender_id) === String(sender_id) &&
          String(msg.receiver_id) === String(receiver_id)
        ) {
          return { ...msg, status: "seen" };
        }
        return msg;
      })]);
    };

    socket.on("messageSeen", handleSeen);
    return () => socket.off("messageSeen", handleSeen);

  }, [myId, otherUserId]);

  // ---------------- TYPING INDICATOR ----------------
  useEffect(() => {
    const handleTyping = ({ senderId }) => {
      if (String(senderId) === String(otherUserId)) setIsTyping(true);
    };
    const handleStopTyping = ({ senderId }) => {
      if (String(senderId) === String(otherUserId)) setIsTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [otherUserId]);

  // ---------------- ONLINE/OFFLINE ----------------
  useEffect(() => {
    const handleOnline = ({ userId }) => {
      if (String(userId) === String(otherUserId)) setIsOnline(true);
    };
    const handleOffline = ({ userId }) => {
      if (String(userId) === String(otherUserId)) setIsOnline(false);
    };
    const handleOnlineStatus = ({ userId, isOnline }) => {
      if (String(userId) === String(otherUserId)) setIsOnline(isOnline);
    };

    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);
    socket.on("userOnlineStatus", handleOnlineStatus);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
      socket.off("userOnlineStatus", handleOnlineStatus);
    };
  }, [otherUserId]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- SEND MESSAGE ----------------
  const send = async () => {
    if (!text.trim()) return;

    const messageText = text;
    setText("");

    try {
      const res = await api.post("/chat/send", {
        receiver_id: otherUserId,
        message: messageText
      });

      const savedMessage = res.data;
      setMessages(prev => [...prev, savedMessage]);
      socket.emit("sendMessage", { message: savedMessage });

    } catch (err) {
      console.error("Send error:", err);
      toast.error("Message failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getAvatar = (name) => name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex flex-col h-full bg-white">

      {/* HEADER */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 bg-white shadow-sm">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-base shrink-0">
          {getAvatar(otherUser)}
        </div>

        {/* Name + Status */}
        <div>
          <p className="font-semibold text-gray-800 text-sm">{otherUser}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center mt-16 text-gray-400">
            <p className="text-3xl mb-2">👋</p>
            <p className="text-sm">No messages yet. Say hi!</p>
          </div>
        )}

        {messages.map((m) => {
          const isMe = String(m.sender_id) === String(myId);
          return (
            <div key={m.message_id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm shadow-sm
                ${isMe
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"}
              `}>
                <p className="leading-relaxed">{m.message}</p>
                <p className={`text-[10px] mt-1 flex justify-end items-center gap-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                  {formatTime(m.created_at)}
                  {isMe && (
                    <span>
                      {m.status === "sent" && <span className="opacity-60">✓</span>}
                      {m.status === "delivered" && <span>✓✓</span>}
                      {m.status === "seen" && <span className="text-cyan-300 font-bold">✓✓</span>}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm shadow-sm flex items-center gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-75">●</span>
              <span className="animate-bounce delay-150">●</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-end gap-2">
        <textarea
          value={text}
          onChange={e => {
            setText(e.target.value);
            socket.emit("typing", { senderId: myId, receiverId: otherUserId });
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              socket.emit("stopTyping", { senderId: myId, receiverId: otherUserId });
            }, 1000);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none bg-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={send}
          className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-105"
        >
          ➤
        </button>
      </div>
    </div>
  );
}