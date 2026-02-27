import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Chat() {
  const { userId } = useParams();
  const otherUserId = userId;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState("");

  const bottomRef = useRef(null);

  // 🔄 Load messages
  useEffect(() => {
    if (!otherUserId) return;

    api.get(`/chat/${otherUserId}`)
      .then(res => {
        setMessages(res.data.messages || []);
        if (res.data.otherUser?.name) {
          setOtherUser(res.data.otherUser.name);
        }
      })
      .catch(() => toast.error("Failed to load chat"));
  }, [otherUserId]);

  // ⬇️ Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⏱ Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✉️ Send message
  const send = async () => {
    if (!text.trim()) return;

    const tempMessage = {
      sender_id: "me",
      message: text,
      created_at: new Date(),
    };

    setMessages(prev => [...prev, tempMessage]);
    setText("");

    try {
      await api.post("/chat/send", {
        receiver_id: otherUserId,
        message: text,
      });
    } catch {
      toast.error("Message failed");
    }
  };

  // ⌨️ Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow">

      {/* HEADER */}
      <div className="p-4 border-b flex items-center gap-2 font-semibold text-lg">
        💬 Chat
        {otherUser && (
          <span className="text-gray-500 text-sm font-normal">
            with {otherUser}
          </span>
        )}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Say hi 👋
          </p>
        )}

        {messages.map((m, i) => {
          const isMe = String(m.sender_id) !== String(otherUserId);

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm
                  ${isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"}
                `}
              >
                <p>{m.message}</p>
                <p className="text-[10px] mt-1 text-right opacity-70">
                  {formatTime(m.created_at)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t flex gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          className="flex-1 resize-none border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={send}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
