import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.jsx";
import GroupHeader from "./GroupHeader";
import GroupMessageInput from "./GroupMessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import "../styles/groupChat.css";

const GroupChatContainer = () => {
  const {
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    selectedGroup,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const audioRefs = useRef({});
  const [playbackRates, setPlaybackRates] = useState({});
  const rateOptions = [1, 1.5, 2];

  useEffect(() => {
    getGroupMessages(selectedGroup._id);
    subscribeToGroupMessages();

    return () => unsubscribeFromGroupMessages();
  }, [
    selectedGroup._id,
    getGroupMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && groupMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  if (isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupHeader />
        <MessageSkeleton />
        <GroupMessageInput />
      </div>
    );
  }

  return (
    <div className="group-chat-container">
      <GroupHeader />

      <div className="group-messages-wrapper">
        {groupMessages.length === 0 ? (
          <div className="group-empty-state">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          groupMessages.map((message) => (
            <div
              key={message._id}
              className={`group-message-item ${
                (message.senderId?._id || message.senderId) === authUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
              ref={messageEndRef}
            >
              <div
                className={`${
                  (message.senderId?._id || message.senderId) === authUser._id
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {(message.senderId?._id || message.senderId) !== authUser._id && (
                  <div className="group-message-sender">
                    {message.senderId?.fullName || "Unknown"}
                  </div>
                )}
                <div className="group-message-content bg-[#334155] text-[#e2e8f0]">
                  {message.replyTo && !message.deletedForEveryone && (
                    <div className="mb-2 p-2 rounded-md bg-[#1e293b] text-xs opacity-80 border-l-2 border-[#3b82f6]">
                      Replying to: {message.replyTo.deletedForEveryone ? "Message deleted" : message.replyTo.text || "Attachment"}
                    </div>
                  )}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.audioMessage?.url && (
                    <div className="voice-message">
                      <audio
                        controls
                        src={message.audioMessage.url}
                        ref={(el) => {
                          if (el) {
                            audioRefs.current[message._id] = el;
                            el.playbackRate = playbackRates[message._id] || 1;
                          }
                        }}
                      />
                      <div className="voice-controls">
                        {rateOptions.map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            className={`voice-rate-btn ${
                              (playbackRates[message._id] || 1) === rate ? "active" : ""
                            }`}
                            onClick={() => {
                              setPlaybackRates((prev) => ({ ...prev, [message._id]: rate }));
                              const audioEl = audioRefs.current[message._id];
                              if (audioEl) audioEl.playbackRate = rate;
                            }}
                          >
                            {rate}x
                          </button>
                        ))}
                        {message.audioMessage?.duration ? (
                          <span className="voice-duration">
                            {Math.floor(message.audioMessage.duration / 60)}:
                            {String(message.audioMessage.duration % 60).padStart(2, "0")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )}
                  {message.deletedForEveryone ? (
                    <p className="text-xs opacity-60 italic">Message deleted</p>
                  ) : (
                    message.text && <p>{message.text}</p>
                  )}
                </div>
                <time className="group-message-time">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            </div>
          ))
        )}
      </div>

      <GroupMessageInput />
    </div>
  );
};

export default GroupChatContainer;
