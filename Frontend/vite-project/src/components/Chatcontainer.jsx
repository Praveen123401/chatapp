import { useChatStore } from "../Store/useChatStore";

import { useEffect, useRef } from "react";
import { Pencil, Reply, Smile, Trash2 } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton"; 
import { useAuthStore } from "../Store/useAuthStore.js";

import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
    typingUsers,
    markMessageAsRead,
    subscribeToReadReceipts,
    unsubscribeFromReadReceipts,
    setReplyToMessage,
    setEditingMessage,
    deleteMessage,
    toggleReaction,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();
    subscribeToTyping();
    subscribeToReadReceipts();

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromTyping();
      unsubscribeFromReadReceipts();
    };
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
    subscribeToReadReceipts,
    unsubscribeFromReadReceipts,
  ]);

  useEffect(() => {
    if (!selectedUser?._id || !messages?.length) return;

    messages
      .filter(
        (message) =>
          message.senderId === selectedUser._id &&
          message.status !== "read"
      )
      .forEach((message) => {
        markMessageAsRead(message._id, selectedUser._id);
      });
  }, [messages, selectedUser?._id, markMessageAsRead]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="chat-container">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const reactionCounts = (reactions = []) => {
    return reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div className="chat-container">
      <ChatHeader />

      <div className="messages-wrapper">
        {messages.length === 0 ? (
          <div className="text-center text-[#94a3b8] py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`message-item ${
                message.senderId === authUser._id ? "sent" : "received"
              }`}
              ref={messageEndRef}
            >
              <div className="flex flex-col">
                <div className="message-bubble">
                  {message.replyTo && !message.deletedForEveryone && (
                    <div className="message-reply">
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
                    message.text && <p className="message-text">{message.text}</p>
                  )}

                  {!message.deletedForEveryone && (
                    <div className="message-actions">
                      <button
                        type="button"
                        className="message-action-btn"
                        onClick={() => setReplyToMessage(message)}
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      {message.senderId === authUser._id && (
                        <>
                          <button
                            type="button"
                            className="message-action-btn"
                            onClick={() => setEditingMessage(message)}
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="message-action-btn delete"
                            onClick={() =>
                              deleteMessage(message._id, true) // true = forEveryone
                            }
                            title="Unsend (delete for everyone)"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs">Unsend</span>
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className="message-action-btn"
                        onClick={() => toggleReaction(message._id, "👍")}
                        title="Like"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="message-action-btn delete"
                        onClick={() =>
                          deleteMessage(message._id, message.senderId === authUser._id)
                        }
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {message.reactions?.length > 0 && (
                    <div className="message-reactions">
                      {Object.entries(reactionCounts(message.reactions)).map(
                        ([emoji, count]) => (
                          <span
                            key={emoji}
                            className="reaction-badge"
                            onClick={() => toggleReaction(message._id, emoji)}
                          >
                            <span className="reaction-emoji">{emoji}</span>
                            <span className="reaction-count">{count}</span>
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="message-footer">
                  <time className="message-time">
                    {formatMessageTime(message.createdAt)}
                  </time>
                  {message.isEdited && <span className="text-[10px]">(edited)</span>}
                  {message.status && message.senderId === authUser._id && (
                    <span className="text-[10px] capitalize">{message.status}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {typingUsers[selectedUser._id] && (
          <div className="typing-indicator">
            <span>Typing</span>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
