import { X } from "lucide-react";
import { useChatStore } from "../Store/useChatStore.jsx";
import "../styles/groupHeader.css";

const GroupHeader = () => {
  const { selectedGroup, setSelectedGroup } = useChatStore();

  const firstLetters = selectedGroup.name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <div className="group-header">
      <div className="group-header-info">
        <div className="group-header-avatar">{firstLetters}</div>
        <div className="group-header-details">
          <h2>{selectedGroup.name}</h2>
          <p>{selectedGroup.members?.length || 0} members</p>
        </div>
      </div>
      <button
        className="group-header-close"
        onClick={() => setSelectedGroup(null)}
        title="Close group"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default GroupHeader;
