import { useState } from "react";
import { useThemeStore } from "../Store/ThemeStore";
import { useAuthStore } from "../Store/useAuthStore"; 
import "./styles/settingPage.css";
import { 
  Palette, MessageSquare, Lock, User, Check, Settings, 
  Zap, Image, Shield, Trash2, Smartphone, Bell
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
  const { authUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("appearance");

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
          </nav>
        </aside>

        {/* CONTENT AREA */}
        <main className="fixed-content">
          
          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="tab-view animate-fade">
              <h1 className="tab-title">Appearance</h1>
              <p className="tab-sub">Choose a theme for your chat workspace.</p>

              <div className="theme-scroll-box">
                <div className="theme-grid">
                  {THEMES.map((t) => (
                    <button 
                      key={t} 
                      onClick={() => setTheme(t)}
                      className={`theme-btn ${theme === t ? "selected" : ""}`}
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

              {/* LIVE PREVIEW: Only this part responds to theme */}
              <div className="preview-wrap" data-theme={theme}>
                <p className="preview-hint">Live Preview: <strong>{theme}</strong></p>
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
          )}

          {/* CHAT & MEDIA TAB */}
          {activeTab === "chat" && (
            <div className="tab-view animate-fade">
              <h1 className="tab-title">Chat & Media</h1>
              <p className="tab-sub">Manage your messaging experience.</p>
              <div className="option-stack">
                <div className="option-card">
                  <div className="opt-icon"><Zap size={20} /></div>
                  <div className="opt-info"><h3>Enter to Send</h3><p>Press Enter to send messages</p></div>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </div>
                <div className="option-card">
                  <div className="opt-icon"><Image size={20} /></div>
                  <div className="opt-info"><h3>Auto-Download</h3><p>Automatically save media</p></div>
                  <input type="checkbox" className="toggle toggle-secondary" />
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
                  <div className="opt-icon"><Shield size={20} /></div>
                  <div className="opt-info"><h3>Read Receipts</h3><p>Allow others to see when you read</p></div>
                  <input type="checkbox" className="toggle toggle-success" defaultChecked />
                </div>
                <div className="option-card">
                  <div className="opt-icon"><Smartphone size={20} /></div>
                  <div className="opt-info"><h3>Two-Factor Auth</h3><p>Secure your account with 2FA</p></div>
                  <button className="btn btn-sm btn-outline">Enable</button>
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
                     <p>{authUser?.email}</p>
                   </div>
                </div>
                <button className="btn btn-error btn-outline btn-sm">
                  <Trash2 size={16} /> Delete Account
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default SettingsPage;