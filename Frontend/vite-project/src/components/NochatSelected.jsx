import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="no-chat-selected">
      <div className="no-chat-icon">
        <MessageSquare size={180} />
      </div>
      <h2 className="no-chat-text">WhatsApp Web</h2>
      <p className="no-chat-subtext">
        Select a chat to start messaging
      </p>
    </div>
  );
};

export default NoChatSelected;
