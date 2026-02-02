import { useState } from "react";

const EmojiPicker = ({ onEmojiSelect, position = "bottom" }) => {
  const [showPicker, setShowPicker] = useState(false);

  const emojis = [
    "😀", "😂", "😍", "🤔", "😎", "🔥",
    "👍", "❤️", "😢", "😡", "🎉", "🚀",
    "💯", "✨", "🙏", "😴", "😤", "🤗",
    "🤮", "😻", "🐶", "🌟", "⚡", "💪"
  ];

  return (
    <div className="emoji-picker-container">
      <button
        className="input-action-btn"
        onClick={() => setShowPicker(!showPicker)}
        title="Emoji"
      >
        😊
      </button>
      {showPicker && (
        <div className="emoji-picker">
          <div className="emoji-grid">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                className="emoji-item"
                onClick={() => {
                  onEmojiSelect(emoji);
                  setShowPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
