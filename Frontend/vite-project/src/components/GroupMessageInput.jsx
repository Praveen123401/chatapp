import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../Store/useChatStore.jsx";
import "../styles/groupMessageInput.css";

const GroupMessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    selectedGroup,
    sendGroupMessage,
    replyToMessage,
    clearReplyToMessage,
  } = useChatStore();

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
      await sendGroupMessage(selectedGroup._id, {
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      clearReplyToMessage();
    } catch (error) {
      console.error("Failed to send group message:", error);
    }
  };

  return (
    <div className="group-message-input-wrapper">
      {replyToMessage && (
        <div className="group-reply-preview">
          <div className="group-reply-preview-content">
            <div className="group-reply-preview-label">Replying</div>
            <div className="group-reply-preview-text">
              {replyToMessage?.text || "Attachment"}
            </div>
          </div>
          <button
            type="button"
            className="group-reply-preview-close"
            onClick={clearReplyToMessage}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {imagePreview && (
        <div className="group-image-preview">
          <div className="group-image-preview-item">
            <img
              src={imagePreview}
              alt="Preview"
            />
            <button
              onClick={removeImage}
              className="group-image-preview-remove"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="group-input-form">
        <div className="group-input-field">
          <input
            type="text"
            className="group-message-input"
            placeholder="Type a group message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="group-input-file"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`group-input-button ${
              imagePreview ? "image-selected" : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="group-send-button"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default GroupMessageInput;
