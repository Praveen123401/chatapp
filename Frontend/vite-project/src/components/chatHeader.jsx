import { X, Phone, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../Store/useAuthStore.js";
import { useChatStore } from "../Store/useChatStore.jsx";
import { formatLastSeen } from "../lib/utils";
import { useState } from "react";
import toast from "react-hot-toast"; 
import "../styles/chatHeader.css";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [calling, setCalling] = useState(false);

  if (!selectedUser) return null;

  const handleVoiceCall = () => {
    if (!onlineUsers.includes(selectedUser._id)) {
      toast.error("User is offline");
      return;
    }
    setCalling("voice");
    toast.success(`Calling ${selectedUser.fullName}...`);
    setTimeout(() => setCalling(false), 5000);
  };

  const handleVideoCall = () => {
    if (!onlineUsers.includes(selectedUser._id)) {
      toast.error("User is offline");
      return;
    }
    setCalling("video");
    toast.success(`Starting video call with ${selectedUser.fullName}...`);
    setTimeout(() => setCalling(false), 5000);
  };

  const isOnline = onlineUsers?.includes(selectedUser._id);

  return (
    <header className="chat-header">
      {/* Left Section - User Info */}
      <div className="chat-header-user">
        {/* Avatar */}
        <div className="chat-header-avatar-wrapper">
          {selectedUser.profilePic ? (
            <img 
              src={selectedUser.profilePic} 
              alt={selectedUser.fullName} 
              className="chat-header-avatar" 
            />
          ) : (
            <div className="chat-header-avatar default">
              {selectedUser.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="chat-header-info">
          <h3 className="chat-header-name">{selectedUser.fullName}</h3>
          <div className="chat-header-status">
            {isOnline ? (
              <>
                <span className="online-dot"></span>
                <span>Online</span>
              </>
            ) : (
              <span>{formatLastSeen(selectedUser.lastSeen) || "Offline"}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Action Buttons */}
      <div className="chat-header-actions">
        <button
          className={`header-action-btn ${!isOnline ? 'disabled' : ''}`}
          onClick={handleVoiceCall}
          disabled={!isOnline}
          title="Voice Call"
        >
          <Phone size={20} strokeWidth={2} />
        </button>
        
        <button
          className={`header-action-btn ${!isOnline ? 'disabled' : ''}`}
          onClick={handleVideoCall}
          disabled={!isOnline}
          title="Video Call"
        >
          <Video size={20} strokeWidth={2} />
        </button>

        <button
          className="header-action-btn"
          onClick={() => setSelectedUser(null)}
          title="Close chat"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Call Status Overlay */}
      {calling && (
        <div className="call-status-overlay">
          <div className="call-status-card">
            <div className="call-animation">
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
            </div>
            <div className="call-info">
              <div className="call-status-title">
                {calling === "voice" ? "📞 Voice Call" : "📹 Video Call"}
              </div>
              <div className="call-status-text">
                Calling {selectedUser.fullName}...
              </div>
            </div>
            <button
              className="call-decline-btn"
              onClick={() => {
                setCalling(false);
                toast.success("Call ended");
              }}
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default ChatHeader;
