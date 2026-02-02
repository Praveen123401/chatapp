import { useEffect, useRef } from "react";
import { useAuthStore } from "../Store/useAuthStore.js";
import { useChatStore } from "../Store/useChatStore.jsx";
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
