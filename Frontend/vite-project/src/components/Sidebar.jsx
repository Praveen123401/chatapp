import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore.js";
import SidebarSkeleton from "./Skeletons/SidebarSkeleton.jsx";
import { Users, UsersRound, Settings, User, LogOut } from "lucide-react"; 
import { useChatStore } from "../Store/useChatStore.jsx";
import "../styles/sidebar.css";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getGroups,
    groups,
    selectedGroup,
    setSelectedGroup,
    createGroup,
  } = useChatStore();

  const { onlineUsers, logout } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const newGroup = await createGroup(groupName.trim(), selectedMembers);
      setSelectedGroup(newGroup);
      setShowCreateGroup(false);
      setGroupName("");
      setSelectedMembers([]);
    } catch (error) {
      // handled in store
    }
  };

  return (
    <aside className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        <h2>Chats</h2>
        <div className="sidebar-tabs">
          <button className="sidebar-tab active">All</button>
          <button 
            className="sidebar-tab"
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
          >
            Online {onlineUsers.length > 1 && `(${onlineUsers.length - 1})`}
          </button>
          <button 
            className="sidebar-tab"
            onClick={() => setShowCreateGroup(true)}
          >
            + Group
          </button>
        </div>
      </div>

      {/* CREATE GROUP MODAL */}
      {showCreateGroup && (
        <div className="create-group-modal">
          <div className="modal-header">
            <h3>New Group</h3>
            <button onClick={() => setShowCreateGroup(false)}>✕</button>
          </div>
          <input
            className="modal-input"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="modal-members">
            {users.map((user) => (
              <label key={user._id} className="modal-member-item">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(user._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMembers([...selectedMembers, user._id]);
                    } else {
                      setSelectedMembers(selectedMembers.filter((id) => id !== user._id));
                    }
                  }}
                />
                <span>{user.fullName}</span>
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <button className="btn-primary" onClick={handleCreateGroup}>
              Create
            </button>
            <button onClick={() => setShowCreateGroup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CONTACTS LIST */}
      <div className="contacts-list">
        {/* GROUPS */}
        {groups.map((group) => (
          <div
            key={group._id}
            onClick={() => setSelectedGroup(group)}
            className={`contact-item ${selectedGroup?._id === group._id ? "active" : ""}`}
          >
            <div className="contact-avatar-wrapper">
              <div className="group-avatar default">
                {group.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="contact-info">
              <div className="contact-name">{group.name}</div>
              <div className="contact-status">
                {group.members?.length || 0} members
              </div>
            </div>
          </div>
        ))}

        {/* USERS */}
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedUser(user);
            }}
            className={`contact-item ${selectedUser?._id === user._id ? "active" : ""}`}
          >
            <div className="contact-avatar-wrapper">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  className="contact-avatar"
                />
              ) : (
                <div className="contact-avatar default">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              {onlineUsers.includes(user._id) && (
                <span className="online-indicator" />
              )}
            </div>
            <div className="contact-info">
              <div className="contact-name">{user.fullName}</div>
              <div className="contact-status">
                {onlineUsers.includes(user._id) ? "online" : "offline"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SIDEBAR FOOTER - Settings, Profile, Logout */}
      <div className="sidebar-footer">
        <Link to="/profile" className="sidebar-footer-btn profile-btn" title="View Profile">
          <User size={18} />
          <span>Profile</span>
        </Link>
        <Link to="/settings" className="sidebar-footer-btn settings-btn" title="Settings">
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <button className="sidebar-footer-btn logout-btn" onClick={logout} title="Logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
