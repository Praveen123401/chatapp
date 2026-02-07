import { useState } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/ThemeStore";
import { useChatWindowColorStore } from "../store/useChatWindowColorStore";
import { useAuthStore } from "../store/useAuthStore"; 
import { useSettingsStore } from "../store/useSettingsStore";
import "./styles/settingPage.css";
import { 
  Palette, MessageSquare, Lock, User, Check, Settings, 
  Zap, Image, Shield, Trash2, Smartphone, Bell, Eye, EyeOff,
  Globe, Users, Clock, Type, Layout, Volume2, VolumeX, Vibrate,
  Download, Camera, Info, Activity, Trash, HardDrive, Power
} from "lucide-react";

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", 
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", 
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", 
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", 
  "dim", "nord", "sunset", "caramellatte", "abyss", "silk"
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { chatWindowColor, setChatWindowColor } = useChatWindowColorStore();
  const { authUser, updateProfile } = useAuthStore();
  const settings = useSettingsStore();
  const [activeTab, setActiveTab] = useState("appearance");
  const [profilePic, setProfilePic] = useState(null);
  
  // Edit states
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    fullName: authUser?.fullName || "",
    about: "Hey there! I'm using this chat app",
    phone: authUser?.phone || ""
  });

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSave = async (field) => {
    // Here you would call your API to update the profile
    // For now, just close the edit mode
    try {
      // await updateProfile({ [field]: editValues[field] });
      setEditingField(null);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({
      fullName: authUser?.fullName || "",
      about: "Hey there! I'm using this chat app",
      phone: authUser?.phone || ""
    });
  };

  return (
    <div className="fixed-dark-wrapper">
      <div className="fixed-main-container">
        
        {/* SIDEBAR: Constant Dark Styling */}
        <aside className="fixed-sidebar">
          <div className="fixed-logo">
            <Settings size={22} className="text-primary" />
            <span>Settings</span>
          </div>
          <nav className="fixed-nav">
            <button onClick={() => setActiveTab("appearance")} className={activeTab === "appearance" ? "active" : ""}>
              <Palette size={18} /> Appearance
            </button>
            <button onClick={() => setActiveTab("chat")} className={activeTab === "chat" ? "active" : ""}>
              <MessageSquare size={18} /> Chat & Media
            </button>
            <button onClick={() => setActiveTab("privacy")} className={activeTab === "privacy" ? "active" : ""}>
              <Lock size={18} /> Privacy
            </button>
            <button onClick={() => setActiveTab("account")} className={activeTab === "account" ? "active" : ""}>
              <User size={18} /> Account
            </button>
            <button onClick={() => setActiveTab("notifications")} className={activeTab === "notifications" ? "active" : ""}>
              <Bell size={18} /> Notifications
            </button>
            <button onClick={() => setActiveTab("storage")} className={activeTab === "storage" ? "active" : ""}>
              <HardDrive size={18} /> Storage
            </button>
          </nav>
        </aside>

        {/* CONTENT AREA */}
        <main className="fixed-content">
          
          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="tab-view animate-fade">
              <h1 className="tab-title">Appearance</h1>
              <p className="tab-sub">Choose a theme for your chat workspace. Changes apply instantly.</p>

              <div className="theme-section">
                <h3 className="theme-section-title">Available Themes</h3>
                <div className="theme-scroll-box">
                  <div className="theme-grid">
                    <button
                      onClick={() => setTheme("system")}
                      className={`theme-btn ${theme === "system" ? "selected" : ""}`}
                      title="Use system theme"
                    >
                      <div className="theme-dots" data-theme="dark">
                        <div className="dot-p"></div>
                        <div className="dot-s"></div>
                        <div className="dot-a"></div>
                      </div>
                      <div className="theme-label">
                        <span>system</span>
                      </div>
                    </button>
                    {THEMES.map((t) => (
                      <button 
                        key={t} 
                        onClick={() => setTheme(t)}
                        className={`theme-btn ${theme === t ? "selected" : ""}`}
                        title={`Switch to ${t} theme`}
                      >
                        <div className="theme-dots" data-theme={t}>
                          <div className="dot-p"></div>
                          <div className="dot-s"></div>
                          <div className="dot-a"></div>
                        </div>
                        <div className="theme-label">
                          <span>{t}</span>
                          {theme === t && <Check size={12} className="text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LIVE PREVIEW: Only this part responds to theme */}
              <div className="preview-section">
                <h3 className="theme-section-title">Live Preview</h3>
                <div className="preview-wrap" data-theme={theme}>
                  <p className="preview-hint">
                    <strong>{theme.toUpperCase()}</strong> Theme Preview
                    <span className="theme-badge">{theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "✨"}</span>
                  </p>
                  <div className="mock-chat bg-base-100">
                    <div className="mock-header bg-base-200 border-b border-base-300">
                      <div className="mock-avatar bg-primary"></div>
                      <span className="text-base-content font-bold">John Doe</span>
                    </div>
                    <div className="mock-messages">
                      <div className="bubble-in bg-base-200 text-base-content">Check out this theme!</div>
                      <div className="bubble-out bg-primary text-primary-content">It looks clean.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIBRANT COLOR PRESETS */}
              <div className="theme-section">
                <h3 className="theme-section-title">🌈 Vibrant Color Themes</h3>
                <div className="vibrant-themes">
                  <button 
                    onClick={() => setTheme("cyberpunk")}
                    className={`vibrant-btn ${theme === "cyberpunk" ? "active" : ""}`}
                    title="Cyberpunk - Neon Colors"
                  >
                    <div className="color-preview cyberpunk-preview"></div>
                    <span>Cyberpunk</span>
                  </button>
                  <button 
                    onClick={() => setTheme("synthwave")}
                    className={`vibrant-btn ${theme === "synthwave" ? "active" : ""}`}
                    title="Synthwave - Pink & Purple"
                  >
                    <div className="color-preview synthwave-preview"></div>
                    <span>Synthwave</span>
                  </button>
                  <button 
                    onClick={() => setTheme("acid")}
                    className={`vibrant-btn ${theme === "acid" ? "active" : ""}`}
                    title="Acid - Rainbow"
                  >
                    <div className="color-preview acid-preview"></div>
                    <span>Acid</span>
                  </button>
                  <button 
                    onClick={() => setTheme("retro")}
                    className={`vibrant-btn ${theme === "retro" ? "active" : ""}`}
                    title="Retro - Bright Colors"
                  >
                    <div className="color-preview retro-preview"></div>
                    <span>Retro</span>
                  </button>
                  <button 
                    onClick={() => setTheme("valentine")}
                    className={`vibrant-btn ${theme === "valentine" ? "active" : ""}`}
                    title="Valentine - Pink & Red"
                  >
                    <div className="color-preview valentine-preview"></div>
                    <span>Valentine</span>
                  </button>
                  <button 
                    onClick={() => setTheme("sunset")}
                    className={`vibrant-btn ${theme === "sunset" ? "active" : ""}`}
                    title="Sunset - Orange & Red"
                  >
                    <div className="color-preview sunset-preview"></div>
                    <span>Sunset</span>
                  </button>
                </div>
              </div>

              {/* CHAT WINDOW COLOR */}
              <div className="theme-section">
                <h3 className="theme-section-title">💬 Chat Window Color</h3>
                <div className="chat-color-grid">
                  {[
                    { name: 'default', label: 'Default', bg: '#0f172a', text: '#f8fafc' },
                    { name: 'ocean', label: 'Ocean', bg: '#0c2340', text: '#e0f2fe' },
                    { name: 'forest', label: 'Forest', bg: '#1a3a2a', text: '#d0f0d0' },
                    { name: 'sunset', label: 'Sunset', bg: '#3d2417', text: '#ffd4a3' },
                    { name: 'purple', label: 'Purple', bg: '#2d1b4e', text: '#e9d5ff' },
                    { name: 'pink', label: 'Pink', bg: '#3d1f2f', text: '#fbcfe8' },
                    { name: 'midnight', label: 'Midnight', bg: '#0a0e27', text: '#f0f4ff' },
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setChatWindowColor(color.name)}
                      className={`chat-color-btn ${chatWindowColor === color.name ? 'active' : ''}`}
                      title={`${color.label} chat color`}
                    >
                      <div 
                        className="color-swatch"
                        style={{
                          backgroundColor: color.bg,
                          borderColor: color.text,
                        }}
                      />
                      <span>{color.label}</span>
                      {chatWindowColor === color.name && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHAT & MEDIA TAB */}
          {activeTab === "chat" && (
            <div className="tab-view animate-fade">
              <h1 className="tab-title">Chat & Media</h1>
              <p className="tab-sub">Manage your messaging experience.</p>
              
              <div className="option-stack">
                <div className="option-card">
                  <div className="opt-icon"><Zap size={20} /></div>
                  <div className="opt-info">
                    <h3>Enter to Send</h3>
                    <p>Press Enter to send messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={settings.enterToSend}
                    onChange={(e) => settings.setEnterToSend(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Download size={20} /></div>
                  <div className="opt-info">
                    <h3>Auto-Download Media</h3>
                    <p>Automatically save images and videos</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-secondary"
                    checked={settings.mediaAutoDownload}
                    onChange={(e) => settings.setMediaAutoDownload(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Type size={20} /></div>
                  <div className="opt-info">
                    <h3>Font Size</h3>
                    <p>Adjust message text size</p>
                  </div>
                  <select 
                    className="select select-bordered select-sm"
                    value={settings.fontSize}
                    onChange={(e) => settings.setFontSize(e.target.value)}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Layout size={20} /></div>
                  <div className="opt-info">
                    <h3>Bubble Style</h3>
                    <p>Choose message bubble appearance</p>
                  </div>
                  <select 
                    className="select select-bordered select-sm"
                    value={settings.bubbleStyle}
                    onChange={(e) => settings.setBubbleStyle(e.target.value)}
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Clock size={20} /></div>
                  <div className="opt-info">
                    <h3>Show Timestamps</h3>
                    <p>Display time on messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-accent"
                    checked={settings.showTimestamps}
                    onChange={(e) => settings.setShowTimestamps(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><MessageSquare size={20} /></div>
                  <div className="opt-info">
                    <h3>Message Grouping</h3>
                    <p>Group consecutive messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-info"
                    checked={settings.messageGrouping}
                    onChange={(e) => settings.setMessageGrouping(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === "privacy" && (
            <div className="tab-view animate-fade">
              <h1 className="tab-title">Privacy & Security</h1>
              <p className="tab-sub">Control your visibility and security settings.</p>
              
              <div className="option-stack">
                <div className="option-card">
                  <div className="opt-icon">{settings.readReceipts ? <Eye size={20} /> : <EyeOff size={20} />}</div>
                  <div className="opt-info">
                    <h3>Read Receipts</h3>
                    <p>Allow others to see when you read messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-success"
                    checked={settings.readReceipts}
                    onChange={(e) => settings.setReadReceipts(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Activity size={20} /></div>
                  <div className="opt-info">
                    <h3>Last Seen</h3>
                    <p>Show your last active time</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary"
                    checked={settings.lastSeen}
                    onChange={(e) => settings.setLastSeen(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Camera size={20} /></div>
                  <div className="opt-info">
                    <h3>Profile Photo</h3>
                    <p>Who can see your profile photo</p>
                  </div>
                  <select 
                    className="select select-bordered select-sm"
                    value={settings.profilePhoto}
                    onChange={(e) => settings.setProfilePhoto(e.target.value)}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">My Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Info size={20} /></div>
                  <div className="opt-info">
                    <h3>About</h3>
                    <p>Who can see your about info</p>
                  </div>
                  <select 
                    className="select select-bordered select-sm"
                    value={settings.about}
                    onChange={(e) => settings.setAbout(e.target.value)}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">My Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Globe size={20} /></div>
                  <div className="opt-info">
                    <h3>Status</h3>
                    <p>Who can see your status updates</p>
                  </div>
                  <select 
                    className="select select-bordered select-sm"
                    value={settings.status}
                    onChange={(e) => settings.setStatus(e.target.value)}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">My Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Shield size={20} /></div>
                  <div className="opt-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add extra security to your account</p>
                  </div>
                  <button className="btn btn-sm btn-outline btn-primary">Enable 2FA</button>
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Users size={20} /></div>
                  <div className="opt-info">
                    <h3>Groups</h3>
                    <p>Who can add you to groups</p>
                  </div>
                  <select className="select select-bordered select-sm">
                    <option>Everyone</option>
                    <option>My Contacts</option>
                    <option>My Contacts Except...</option>
                    <option>Nobody</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="tab-view animate-fade">
              <h1 className="tab-title">Account</h1>
              <p className="tab-sub">Manage your personal information.</p>
              
              <div className="account-card">
                <div className="user-profile">
                   <div className="avatar-large">{authUser?.fullName?.charAt(0) || "U"}</div>
                   <div className="user-details">
                     <h3>{authUser?.fullName}</h3>
                     <p>📧 {authUser?.email}</p>
                   </div>
                </div>
                <div className="account-quick-actions">
                  <Link to="/profile" className="btn btn-primary btn-sm">
                    <Camera size={16} /> Change Avatar
                  </Link>
                  <Link to="/profile" className="btn btn-sm btn-ghost">
                    <Power size={16} /> Status
                  </Link>
                </div>
              </div>

              <div className="option-stack mt-4">
                <div className="account-option-card">
                  <div className="account-opt-icon"><Power size={22} /></div>
                  <div className="account-opt-info">
                    <h3>Status</h3>
                    <p>Set your online/offline status</p>
                  </div>
                  <Link to="/profile" className="btn btn-sm btn-ghost">
                    Manage
                  </Link>
                </div>
              </div>
              
              <div className="option-stack mt-4">
                {/* Full Name */}
                <div className="account-option-card">
                  <div className="account-opt-icon"><User size={22} /></div>
                  <div className="account-opt-info">
                    <h3>Full Name</h3>
                    {editingField === 'fullName' ? (
                      <input
                        type="text"
                        value={editValues.fullName}
                        onChange={(e) => setEditValues({...editValues, fullName: e.target.value})}
                        placeholder="Enter your full name"
                        autoFocus
                      />
                    ) : (
                      <p>{authUser?.fullName || "Not set"}</p>
                    )}
                  </div>
                  {editingField === 'fullName' ? (
                    <div className="btn-group">
                      <button className="btn btn-sm btn-success" onClick={() => handleSave('fullName')}>
                        <Check size={16} /> Save
                      </button>
                      <button className="btn btn-sm btn-ghost" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-ghost" onClick={() => handleEdit('fullName')}>
                      Edit
                    </button>
                  )}
                </div>
                
                {/* About */}
                <div className="account-option-card">
                  <div className="account-opt-icon"><Info size={22} /></div>
                  <div className="account-opt-info">
                    <h3>About</h3>
                    {editingField === 'about' ? (
                      <textarea
                        value={editValues.about}
                        onChange={(e) => setEditValues({...editValues, about: e.target.value})}
                        placeholder="Write something about yourself..."
                        autoFocus
                      />
                    ) : (
                      <p>{editValues.about}</p>
                    )}
                  </div>
                  {editingField === 'about' ? (
                    <div className="btn-group">
                      <button className="btn btn-sm btn-success" onClick={() => handleSave('about')}>
                        <Check size={16} /> Save
                      </button>
                      <button className="btn btn-sm btn-ghost" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-ghost" onClick={() => handleEdit('about')}>
                      Edit
                    </button>
                  )}
                </div>
                
                {/* Email - Non-editable */}
                <div className="account-option-card">
                  <div className="account-opt-icon"><Globe size={22} /></div>
                  <div className="account-opt-info">
                    <h3>Email</h3>
                    <p>{authUser?.email}</p>
                  </div>
                  <span className="badge badge-ghost">Verified</span>
                </div>
                
                {/* Phone */}
                <div className="account-option-card">
                  <div className="account-opt-icon"><Smartphone size={22} /></div>
                  <div className="account-opt-info">
                    <h3>Phone Number</h3>
                    {editingField === 'phone' ? (
                      <input
                        type="tel"
                        value={editValues.phone}
                        onChange={(e) => setEditValues({...editValues, phone: e.target.value})}
                        placeholder="Enter your phone number"
                        autoFocus
                      />
                    ) : (
                      <p>{editValues.phone || "Not set"}</p>
                    )}
                  </div>
                  {editingField === 'phone' ? (
                    <div className="btn-group">
                      <button className="btn btn-sm btn-success" onClick={() => handleSave('phone')}>
                        <Check size={16} /> Save
                      </button>
                      <button className="btn btn-sm btn-ghost" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-ghost" onClick={() => handleEdit('phone')}>
                      {editValues.phone ? "Edit" : "Add"}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="delete-section">
                <div className="delete-warning">
                  <h4><Shield size={20} /> Danger Zone</h4>
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <button className="btn btn-error btn-outline btn-sm w-full">
                  <Trash2 size={16} /> Delete Account Permanently
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="tab-view animate-fade">
              <h1 className="tab-title">Notifications</h1>
              <p className="tab-sub">Manage how you receive notifications.</p>
              
              <div className="option-stack">
                <div className="option-card">
                  <div className="opt-icon"><Bell size={20} /></div>
                  <div className="opt-info">
                    <h3>Notifications</h3>
                    <p>Enable or disable all notifications</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary"
                    checked={settings.notificationsEnabled}
                    onChange={(e) => settings.setNotificationsEnabled(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon">{settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</div>
                  <div className="opt-info">
                    <h3>Sound</h3>
                    <p>Play sound for new messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-success"
                    checked={settings.soundEnabled}
                    onChange={(e) => settings.setSoundEnabled(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Vibrate size={20} /></div>
                  <div className="opt-info">
                    <h3>Vibration</h3>
                    <p>Vibrate for notifications</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-secondary"
                    checked={settings.vibration}
                    onChange={(e) => settings.setVibration(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><MessageSquare size={20} /></div>
                  <div className="opt-info">
                    <h3>Message Preview</h3>
                    <p>Show message content in notifications</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-accent"
                    checked={settings.messagePreview}
                    onChange={(e) => settings.setMessagePreview(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Layout size={20} /></div>
                  <div className="opt-info">
                    <h3>Popup Notifications</h3>
                    <p>Show popup for new messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-info"
                    checked={settings.popupNotifications}
                    onChange={(e) => settings.setPopupNotifications(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Users size={20} /></div>
                  <div className="opt-info">
                    <h3>Group Notifications</h3>
                    <p>Notify for group messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-warning"
                    checked={settings.groupNotifications}
                    onChange={(e) => settings.setGroupNotifications(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Volume2 size={20} /></div>
                  <div className="opt-info">
                    <h3>Notification Sound</h3>
                    <p>Choose your notification tone</p>
                  </div>
                  <select 
                    className="select select-bordered select-sm"
                    value={settings.messageSound}
                    onChange={(e) => settings.setMessageSound(e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="chime">Chime</option>
                    <option value="bell">Bell</option>
                    <option value="pop">Pop</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STORAGE TAB */}
          {activeTab === "storage" && (
            <div className="tab-view animate-fade">
              <h1 className="tab-title">Storage & Data</h1>
              <p className="tab-sub">Manage your storage and data usage.</p>
              
              <div className="option-stack">
                <div className="option-card">
                  <div className="opt-icon"><HardDrive size={20} /></div>
                  <div className="opt-info">
                    <h3>Storage Usage</h3>
                    <p>View and manage storage</p>
                  </div>
                  <button className="btn btn-sm btn-outline">View</button>
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Download size={20} /></div>
                  <div className="opt-info">
                    <h3>Media Auto-Download</h3>
                    <p>Automatically download media</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary"
                    checked={settings.mediaAutoDownload}
                    onChange={(e) => settings.setMediaAutoDownload(e.target.checked)}
                  />
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Trash size={20} /></div>
                  <div className="opt-info">
                    <h3>Auto-Delete Messages</h3>
                    <p>Automatically delete old messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-error"
                    checked={settings.autoDeleteMessages}
                    onChange={(e) => settings.setAutoDeleteMessages(e.target.checked)}
                  />
                </div>
                
                {settings.autoDeleteMessages && (
                  <div className="option-card">
                    <div className="opt-icon"><Clock size={20} /></div>
                    <div className="opt-info">
                      <h3>Delete After</h3>
                      <p>Days before auto-deletion</p>
                    </div>
                    <select 
                      className="select select-bordered select-sm"
                      value={settings.autoDeleteDays}
                      onChange={(e) => settings.setAutoDeleteDays(Number(e.target.value))}
                    >
                      <option value="7">7 Days</option>
                      <option value="30">30 Days</option>
                      <option value="90">90 Days</option>
                      <option value="180">180 Days</option>
                    </select>
                  </div>
                )}
                
                <div className="option-card">
                  <div className="opt-icon"><Trash2 size={20} /></div>
                  <div className="opt-info">
                    <h3>Clear Cache</h3>
                    <p>Free up space by clearing cache</p>
                  </div>
                  <button className="btn btn-sm btn-outline btn-warning">Clear</button>
                </div>
                
                <div className="option-card">
                  <div className="opt-icon"><Image size={20} /></div>
                  <div className="opt-info">
                    <h3>Clear Media</h3>
                    <p>Delete all downloaded media</p>
                  </div>
                  <button className="btn btn-sm btn-outline btn-error">Clear All</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default SettingsPage;