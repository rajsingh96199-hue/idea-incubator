import { useEffect, useState } from "react";
import api from "../services/api";
import Chat from "./Chat";
import socket from "../services/socket";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [search, setSearch] = useState("");

  const myId = localStorage.getItem("userId");

  useEffect(() => {
    if (!myId) return;
    socket.emit("join", String(myId));
  }, [myId]);

  useEffect(() => {
    api.get("/chat/conversations")
      .then(res => {
        const list = res.data.conversations || [];
        setConversations(list);

        const counts = {};
        list.forEach(c => {
          counts[c.user_id] = c.unread_count || 0;
        });
        setUnreadCounts(counts);

        if (list.length > 0 && !activeUser) {
          setActiveUser(list[0].user_id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleReceive = (msg) => {
      if (String(msg.sender_id) !== String(activeUser)) {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.sender_id]: (prev[msg.sender_id] || 0) + 1
        }));
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [activeUser]);

  const handleSelectUser = (userId) => {
    setActiveUser(userId);
    setUnreadCounts(prev => ({ ...prev, [userId]: 0 }));
  };

  const filteredConversations = conversations.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getAvatar = (name) => name?.charAt(0)?.toUpperCase() || "?";

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 86400) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  return (
    <div className="flex h-[85vh] bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 ml-0">

      {/* LEFT PANEL */}
      <div className="w-80 shrink-0 flex flex-col border-r border-gray-100">

        {/* Left Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Messages</h2>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-2xl mb-1">💬</p>
              <p className="text-sm">No conversations yet</p>
            </div>
          )}

          {filteredConversations.map(c => (
            <div
              key={c.user_id}
              onClick={() => handleSelectUser(c.user_id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150
                ${activeUser === c.user_id
                  ? "bg-blue-50 border-r-2 border-blue-500"
                  : "hover:bg-gray-50"}
              `}
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-base shrink-0">
                {getAvatar(c.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className={`font-semibold text-sm truncate ${activeUser === c.user_id ? "text-blue-700" : "text-gray-800"}`}>
                    {c.name}
                  </p>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                    {formatTime(c.last_time)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-xs text-gray-500 truncate">{c.last_message}</p>
                  {unreadCounts[c.user_id] > 0 && (
                    <span className="bg-green-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ml-1 shrink-0">
                      {unreadCounts[c.user_id] > 99 ? "99+" : unreadCounts[c.user_id]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1">
        {activeUser ? (
          <Chat key={activeUser} userId={activeUser} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
            <p className="text-5xl">💬</p>
            <p className="text-lg font-medium text-gray-500">Select a conversation</p>
            <p className="text-sm">Choose from your existing conversations</p>
          </div>
        )}
      </div>
    </div>
  );
}