// import { X, Phone, Video, MoreVertical } from "lucide-react";
// import { useAuthStore } from "../Store/useAuthStore.js";
// import { useChatStore } from "../Store/useChatStore.jsx";
// import { formatLastSeen } from "../lib/utils";
// import { useState } from "react";
// import toast from "react-hot-toast"; 
// import "../styles/chatHeader.css";

// const ChatHeader = () => {
//   const { selectedUser, setSelectedUser } = useChatStore();
//   const { onlineUsers } = useAuthStore();
//   const [calling, setCalling] = useState(false);

//   if (!selectedUser) return null;

//   const handleVoiceCall = () => {
//     if (!onlineUsers.includes(selectedUser._id)) {
//       toast.error("User is offline");
//       return;
//     }
//     setCalling("voice");
//     toast.success(`Calling ${selectedUser.fullName}...`);
//     setTimeout(() => setCalling(false), 5000);
//   };

//   const handleVideoCall = () => {
//     if (!onlineUsers.includes(selectedUser._id)) {
//       toast.error("User is offline");
//       return;
//     }
//     setCalling("video");
//     toast.success(`Starting video call with ${selectedUser.fullName}...`);
//     setTimeout(() => setCalling(false), 5000);
//   };

//   const isOnline = onlineUsers?.includes(selectedUser._id);

//   return (
//     <header className="chat-header">
//       {/* Left Section - User Info */}
//       <div className="chat-header-user">
//         {/* Avatar */}
//         <div className="chat-header-avatar-wrapper">
//           {selectedUser.profilePic ? (
//             <img 
//               src={selectedUser.profilePic} 
//               alt={selectedUser.fullName} 
//               className="chat-header-avatar" 
//             />
//           ) : (
//             <div className="chat-header-avatar default">
//               {selectedUser.fullName?.charAt(0).toUpperCase()}
//             </div>
//           )}
//         </div>
        
//         {/* Info */}
//         <div className="chat-header-info">
//           <h3 className="chat-header-name">{selectedUser.fullName}</h3>
//           <div className="chat-header-status">
//             {isOnline ? (
//               <>
//                 <span className="online-dot"></span>
//                 <span>Online</span>
//               </>
//             ) : (
//               <span>{formatLastSeen(selectedUser.lastSeen) || "Offline"}</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Right Section - Action Buttons */}
//       <div className="chat-header-actions">
//         <button
//           className={`header-action-btn ${!isOnline ? 'disabled' : ''}`}
//           onClick={handleVoiceCall}
//           disabled={!isOnline}
//           title="Voice Call"
//         >
//           <Phone size={20} strokeWidth={2} />
//         </button>
        
//         <button
//           className={`header-action-btn ${!isOnline ? 'disabled' : ''}`}
//           onClick={handleVideoCall}
//           disabled={!isOnline}
//           title="Video Call"
//         >
//           <Video size={20} strokeWidth={2} />
//         </button>

//         <button
//           className="header-action-btn"
//           onClick={() => setSelectedUser(null)}
//           title="Close chat"
//         >
//           <X size={20} strokeWidth={2} />
//         </button>
//       </div>

//       {/* Call Status Overlay */}
//       {calling && (
//         <div className="call-status-overlay">
//           <div className="call-status-card">
//             <div className="call-animation">
//               <div className="pulse-ring"></div>
//               <div className="pulse-ring"></div>
//               <div className="pulse-ring"></div>
//             </div>
//             <div className="call-info">
//               <div className="call-status-title">
//                 {calling === "voice" ? "📞 Voice Call" : "📹 Video Call"}
//               </div>
//               <div className="call-status-text">
//                 Calling {selectedUser.fullName}...
//               </div>
//             </div>
//             <button
//               className="call-decline-btn"
//               onClick={() => {
//                 setCalling(false);
//                 toast.success("Call ended");
//               }}
//             >
//               End Call
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default ChatHeader; 

import { X, Phone, Video, Mic, VideoOff, PhoneOff, MicOff, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.jsx";
import { useCallStore } from "../store/useCallStore.js";
import { formatLastSeen } from "../lib/utils";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import "../styles/chatHeader.css";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, messages } = useChatStore();
  const { onlineUsers, socket } = useAuthStore();
  const {
    isCallActive,
    callType,
    callDuration,
    callStatus,
    isMicMuted,
    isCameraMuted,
    startCall,
    endCall,
    toggleMic,
    toggleCamera,
    acceptCall,
    rejectCall,
    setLocalStream,
    setRemoteStream,
    localStream,
    remoteStream,
  } = useCallStore();

  const [displayTime, setDisplayTime] = useState("00:00");
  const [incomingCall, setIncomingCall] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteUserIdRef = useRef(null);
  const isCallerRef = useRef(false);

  if (!selectedUser) return null;

  const isOnline = onlineUsers?.includes(selectedUser._id);
  const avatarUrl = selectedUser.profilePic || "";

  // Search messages
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const results = messages
      .map((msg, index) => ({ ...msg, index }))
      .filter((msg) =>
        msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    setSearchResults(results);
    setCurrentResultIndex(0);

    if (results.length > 0) {
      scrollToMessage(results[0]._id);
    }
  }, [searchQuery, messages]);

  const scrollToMessage = (messageId) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("highlight-message");
      setTimeout(() => {
        messageElement.classList.remove("highlight-message");
      }, 2000);
    }
  };

  const navigateResults = (direction) => {
    if (searchResults.length === 0) return;
    
    let newIndex;
    if (direction === "next") {
      newIndex = (currentResultIndex + 1) % searchResults.length;
    } else {
      newIndex = currentResultIndex === 0 ? searchResults.length - 1 : currentResultIndex - 1;
    }
    
    setCurrentResultIndex(newIndex);
    scrollToMessage(searchResults[newIndex]._id);
  };

  const cleanupPeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    remoteUserIdRef.current = null;
    isCallerRef.current = false;
  };

  const createPeerConnection = (remoteUserId, stream, isCaller) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    remoteUserIdRef.current = remoteUserId;
    isCallerRef.current = isCaller;

    pc.onicecandidate = (event) => {
      if (!event.candidate || !socket || !remoteUserIdRef.current) return;

      const payload = {
        signal: { candidate: event.candidate },
        to: remoteUserIdRef.current,
      };

      if (isCallerRef.current) {
        socket.emit("sendSignal", payload);
      } else {
        socket.emit("returnSignal", payload);
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        acceptCall();
      }
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        endCall();
        cleanupPeerConnection();
      }
    };

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    peerConnectionRef.current = pc;
    return pc;
  };

  const createAndSendOffer = async () => {
    const pc = peerConnectionRef.current;
    if (!pc || !socket || !remoteUserIdRef.current) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("sendSignal", {
      signal: { sdp: pc.localDescription },
      to: remoteUserIdRef.current,
    });
  };

  const handleIncomingSignal = async (signal) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (signal?.sdp) {
      const desc = new RTCSessionDescription(signal.sdp);
      await pc.setRemoteDescription(desc);

      if (desc.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        if (socket && remoteUserIdRef.current) {
          socket.emit("returnSignal", {
            signal: { sdp: pc.localDescription },
            to: remoteUserIdRef.current,
          });
        }
      }
    }

    if (signal?.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      } catch (error) {
        console.error("ICE candidate error:", error);
      }
    }
  };

  // Setup socket listeners for calls
  useEffect(() => {
    if (!socket) return;

    socket.on("incomingCall", (data) => {
      if (!isCallActive) {
        setIncomingCall(data);
        toast.info(`Incoming ${data.callType} call from ${data.callerInfo?.fullName}`);
      }
    });

    socket.on("callAccepted", async () => {
      try {
        await createAndSendOffer();
      } catch (error) {
        console.error("Offer error:", error);
        toast.error("Failed to start call");
      }
    });

    socket.on("callRejected", () => {
      toast.error("Call was rejected");
      endCall();
      cleanupPeerConnection();
    });

    socket.on("callEnded", () => {
      toast.info("Call ended");
      endCall();
      cleanupPeerConnection();
    });

    socket.on("receiveSignal", async ({ signal, from }) => {
      if (!peerConnectionRef.current && localStream) {
        createPeerConnection(from, localStream, false);
      }
      await handleIncomingSignal(signal);
    });

    socket.on("receiveReturnSignal", async ({ signal }) => {
      await handleIncomingSignal(signal);
    });

    socket.on("callFailed", ({ message }) => {
      toast.error(message || "Call failed");
      endCall();
      cleanupPeerConnection();
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callRejected");
      socket.off("callEnded");
      socket.off("receiveSignal");
      socket.off("receiveReturnSignal");
      socket.off("callFailed");
    };
  }, [socket, isCallActive, endCall, localStream]);

  // Format call duration
  useEffect(() => {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    setDisplayTime(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
  }, [callDuration]);

  // Increment call timer
  useEffect(() => {
    if (!isCallActive || callStatus !== "connected") return;
    
    const interval = setInterval(() => {
      setDisplayTime((prev) => {
        const [mins, secs] = prev.split(":").map(Number);
        const totalSeconds = mins * 60 + secs + 1;
        const newMins = Math.floor(totalSeconds / 60);
        const newSecs = totalSeconds % 60;
        return `${String(newMins).padStart(2, "0")}:${String(newSecs).padStart(2, "0")}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCallActive, callStatus]);

  // Display remote video
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleVoiceCall = async () => {
    if (!isOnline) {
      toast.error("User is offline");
      return;
    }
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      createPeerConnection(selectedUser._id, stream, true);
      startCall(selectedUser._id, "voice");
      
      // Send call signal via socket
      if (socket) {
        socket.emit("callUser", {
          receiverId: selectedUser._id,
          callType: "voice",
          callerInfo: {
            fullName: selectedUser.fullName,
          }
        });
      }
    } catch (error) {
      toast.error("Microphone access denied");
      console.error("Audio error:", error);
    }
  };

  const handleVideoCall = async () => {
    if (!isOnline) {
      toast.error("User is offline");
      return;
    }
    
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      createPeerConnection(selectedUser._id, stream, true);
      startCall(selectedUser._id, "video");
      
      // Send call signal via socket
      if (socket) {
        socket.emit("callUser", {
          receiverId: selectedUser._id,
          callType: "video",
          callerInfo: {
            fullName: selectedUser.fullName,
          }
        });
      }
    } catch (error) {
      toast.error("Camera/Microphone access denied");
      console.error("Video error:", error);
    }
  };

  const handleAcceptCall = async () => {
    if (!incomingCall) return;

    try {
      startCall(incomingCall.callerId, incomingCall.callType);
      
      // Setup media stream
      if (incomingCall.callType === "voice") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
        createPeerConnection(incomingCall.callerId, stream, false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        createPeerConnection(incomingCall.callerId, stream, false);
      }

      // Notify caller
      if (socket) {
        socket.emit("acceptCall", { callerId: incomingCall.callerId });
      }
      
      setIncomingCall(null);
    } catch (error) {
      toast.error("Failed to accept call");
      console.error("Accept call error:", error);
    }
  };

  const handleRejectCall = () => {
    if (incomingCall && socket) {
      socket.emit("rejectCall", { callerId: incomingCall.callerId });
    }
    setIncomingCall(null);
  };

  const handleEndCall = () => {
    if (socket && selectedUser) {
      socket.emit("endCall", { otherUserId: selectedUser._id });
    }
    endCall();
    cleanupPeerConnection();
  };

  return (
    <>
      {/* ================= CHAT HEADER ================= */}
      <header className="chat-header">
        {/* LEFT */}
        <div className="chat-header-user">
          <div className="chat-header-avatar-wrapper">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={selectedUser.fullName}
                className="chat-header-avatar"
              />
            ) : (
              <div className="chat-header-avatar default">
                {selectedUser.fullName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="chat-header-info">
            <h3 className="chat-header-name">{selectedUser.fullName}</h3>
            <div className="chat-header-status">
              {isOnline ? (
                <>
                  <span className="online-dot"></span>
                  <span>Online</span>
                </>
              ) : (
                <span>
                  {formatLastSeen(selectedUser.lastSeen) || "Offline"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="chat-header-actions">
          <button
            className="header-action-btn"
            onClick={() => setShowSearch(!showSearch)}
            title="Search Messages"
          >
            <Search size={20} />
          </button>

          <button
            className="header-action-btn"
            onClick={handleVoiceCall}
            disabled={!isOnline || isCallActive}
            title="Voice Call"
          >
            <Phone size={20} />
          </button>

          <button
            className="header-action-btn"
            onClick={handleVideoCall}
            disabled={!isOnline || isCallActive}
            title="Video Call"
          >
            <Video size={20} />
          </button>

          <button
            className="header-action-btn"
            onClick={() => setSelectedUser(null)}
            title="Close Chat"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {!isCallActive && (
        <div className="call-quick-actions">
          <button
            className="call-quick-btn voice"
            onClick={handleVoiceCall}
            disabled={!isOnline}
          >
            <Phone size={18} />
            <span>Voice Call</span>
          </button>
          <button
            className="call-quick-btn video"
            onClick={handleVideoCall}
            disabled={!isOnline}
          >
            <Video size={18} />
            <span>Video Call</span>
          </button>
        </div>
      )}

      {/* ================= SEARCH BAR ================= */}
      {showSearch && (
        <div className="chat-search-bar">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
          {searchResults.length > 0 && (
            <div className="search-results-info">
              <span>{currentResultIndex + 1} of {searchResults.length}</span>
              <div className="search-nav-btns">
                <button onClick={() => navigateResults("prev")} title="Previous">▲</button>
                <button onClick={() => navigateResults("next")} title="Next">▼</button>
              </div>
            </div>
          )}
          <button 
            className="search-close-btn"
            onClick={() => {
              setShowSearch(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ================= INCOMING CALL UI ================= */}
      {incomingCall && !isCallActive && (
        <div className="call-overlay-full">
          <div
            className="call-bg"
            style={{
              backgroundImage: `url(${incomingCall.callerInfo?.avatar || "linear-gradient(135deg,#020617,#1e293b)"})`,
            }}
          ></div>

          <div className="call-ui">
            <div className="call-avatar">
              <div className="call-avatar-fallback">
                {incomingCall.callerInfo?.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>

            <h2>Incoming {incomingCall.callType} Call</h2>
            <p className="call-status-text">{incomingCall.callerInfo?.fullName}</p>

            {/* Pulse Animation */}
            <div className="call-pulse">
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* Controls */}
            <div className="call-controls">
              <button
                className="call-accept"
                onClick={handleAcceptCall}
                title="Accept call"
                aria-label="Accept call"
              >
                <Phone size={22} />
              </button>

              <button
                className="call-end"
                onClick={handleRejectCall}
                title="Reject call"
                aria-label="Reject call"
              >
                <PhoneOff size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ACTIVE CALL UI ================= */}
      {isCallActive && (
        <div className="call-overlay-full">
          {/* Background */}
          <div
            className="call-bg"
            style={{
              backgroundImage: avatarUrl
                ? `url(${avatarUrl})`
                : "linear-gradient(135deg,#020617,#1e293b)",
            }}
          ></div>

          {/* Call UI */}
          <div className="call-ui">
            {callType === "video" && (
              <div className="video-placeholder">
                <video
                  ref={remoteVideoRef}
                  id="remoteVideo"
                  className="remote-video"
                  autoPlay
                  playsInline
                ></video>
                <video
                  ref={localVideoRef}
                  id="localVideo"
                  className="local-video"
                  autoPlay
                  muted
                  playsInline
                ></video>
              </div>
            )}

            <div className="call-avatar">
              {avatarUrl && callType === "voice" ? (
                <img src={avatarUrl} alt={selectedUser.fullName} />
              ) : (
                <div className="call-avatar-fallback">
                  {selectedUser.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h2>{selectedUser.fullName}</h2>
            <p className="call-status-text">
              {callStatus === "ringing"
                ? `${callType === "voice" ? "📞" : "📹"} ${callType} calling…`
                : `Connected • ${displayTime}`}
            </p>

            {/* Pulse Animation */}
            <div className="call-pulse">
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* Controls */}
            <div className="call-controls">
              <button
                className={`call-control ${isMicMuted ? "muted" : ""}`}
                onClick={toggleMic}
                title={isMicMuted ? "Unmute mic" : "Mute mic"}
                aria-label="Toggle microphone"
              >
                {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                className="call-end"
                onClick={handleEndCall}
                title="End call"
                aria-label="End call"
              >
                <PhoneOff size={22} />
              </button>

              {callType === "video" && (
                <button
                  className={`call-control ${isCameraMuted ? "muted" : ""}`}
                  onClick={toggleCamera}
                  title={isCameraMuted ? "Turn on camera" : "Turn off camera"}
                  aria-label="Toggle camera"
                >
                  {isCameraMuted ? <VideoOff size={20} /> : <Video size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;

