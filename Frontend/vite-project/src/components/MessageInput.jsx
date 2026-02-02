import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const {
    sendMessage,
    handleTyping,
    selectedUser,
    replyToMessage,
    clearReplyToMessage,
    editingMessage,
    editMessage,
    clearEditingMessage,
  } = useChatStore();

  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "😍", "🥳", "👏", "💯"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      if (editingMessage) {
        await editMessage(editingMessage._id, text.trim());
      } else {
        await sendMessage({
          text: text.trim(),
          image: imagePreview,
        });
      }

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (selectedUser?._id) {
        handleTyping(selectedUser._id, false);
      }

      clearReplyToMessage();
      clearEditingMessage();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!selectedUser?._id) return;
    handleTyping(selectedUser._id, value.length > 0);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(selectedUser._id, false);
    }, 800);
  };

  useEffect(() => {
    if (!editingMessage) return;
    setText(editingMessage.text || "");
    setImagePreview(null);
  }, [editingMessage]);

  return (
    <div className="message-input-container">
      {/* REPLY/EDIT PREVIEW */}
      {(replyToMessage || editingMessage) && (
        <div className="reply-preview">
          <div className="reply-text">
            <div className="reply-label">
              {editingMessage ? "✏️ Editing" : "↩️ Replying"}
            </div>
            <div className="reply-content">
              {editingMessage?.text || replyToMessage?.text || "Attachment"}
            </div>
          </div>
          <button onClick={() => { clearReplyToMessage(); clearEditingMessage(); }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
          <button className="remove-image" onClick={removeImage}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* INPUT FORM */}
      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="message-input-actions">
          <button
            type="button"
            className="input-action-btn"
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <Smile size={22} />
          </button>
          
          <button
            type="button"
            className="input-action-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={22} />
          </button>
        </div>

        <textarea
          className="message-input-field"
          placeholder="Type a message"
          value={text}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          rows={1}
        />

        <button
          type="submit"
          className="message-send-btn"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </form>

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div className="emoji-picker">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setText(text + emoji);
                setShowEmoji(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default MessageInput;
