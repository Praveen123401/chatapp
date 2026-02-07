



// import { useState, useEffect } from "react";
// import { useAuthStore } from "../Store/useAuthStore";
// import { 
//   Camera, Mail, User, ShieldCheck, Trash2, Check, X, 
//   Loader2, Phone, Cake, Calendar, Settings, Power, 
//   Activity, Bell, Lock, Globe, Share2, Award, Zap
// } from "lucide-react"; 
// import "./styles/profilePage.css";

// const ProfilePage = () => {
//   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
//   const [pendingImg, setPendingImg] = useState(null);
//   const [activeTab, setActiveTab] = useState("general");
//   const [showNotification, setShowNotification] = useState(false);

//   // Handle Image Selection
//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => setPendingImg(reader.result);
//   };

//   // Handle Photo Save
//   const handleSavePhoto = async () => {
//     if (!pendingImg) return;
//     await updateProfile({ profilepic: pendingImg });
//     setPendingImg(null);
//     triggerToast();
//   };

//   // Toggle Status Function
//   const toggleStatus = async () => {
//     await updateProfile({ online: !authUser.online });
//     triggerToast();
//   };

//   const triggerToast = () => {
//     setShowNotification(true);
//     setTimeout(() => setShowNotification(false), 3000);
//   };

//   return (
//     <div className="pro-dashboard-layout">
//       {/* GLOBAL TOAST NOTIFICATION */}
//       <div className={`toast-alert ${showNotification ? "show" : ""}`}>
//         <Check size={18} /> Settings Updated Successfully
//       </div>

//       <div className="main-glass-frame">
        
//         {/* LEFT SIDEBAR: IDENTITY & CORE CONTROLS */}
//         <aside className="sidebar-identity">
//           <div className="avatar-master-wrapper">
//             {/* BLINKING AURA RING */}
//             <div className={`aura-ring ${authUser?.online ? "aura-active" : "aura-idle"}`}>
//               <img
//                 src={
//                   authUser?.profilepic && authUser.profilepic.trim() !== ""
//                     ? authUser.profilepic
//                     : "/avatar.png"
//                 }
//                 alt="profile"
//                 className="profile-master-img"
//               />
//               <label className="image-edit-trigger">
//                 <Camera size={18} />
//                 <input type="file" hidden onChange={handleImageSelect} />
//               </label>
//             </div>

//             <div className="user-branding">
//               <h2>{authUser?.fullName} <ShieldCheck size={5} className="v-icon" /></h2>
//               <p className="user-role">Premium Member</p>
//             </div>

//             {/* INTEGRATED STATUS TOGGLE BUTTON */}
//             <div className="status-control-container">
//               <button 
//                 className={`pro-status-btn ${authUser?.online ? "online" : "offline"}`}
//                 onClick={toggleStatus}
//               >
//                 <div className="btn-glow"></div>
//                 <Power size={16} />
//                 <span>{authUser?.online ? "System Online" : "System Offline"}</span>
//                 <div className="led-indicator"></div>
//               </button>
//             </div>

//             {/* STABLE ACTION BAR FOR UPLOADS */}
//             <div className="upload-stabilizer">
//               {pendingImg ? (
//                 <div className="upload-actions animate-pop">
//                   <button onClick={handleSavePhoto} className="btn-apply">
//                     {isUpdatingProfile ? <Loader2 className="spin" size={16}/> : <Check size={16}/>}
//                     Confirm Change
//                   </button>
//                   <button onClick={() => setPendingImg(null)} className="btn-deny"><X size={16}/></button>
//                 </div>
//               ) : (
//                 authUser?.profilepic && (
//                   <button className="btn-remove-soft" onClick={() => updateProfile({ profilepic: "" })}>
//                     <Trash2 size={13} /> Remove Profile Picture
//                   </button>
//                 )
//               )}
//             </div>
//           </div>

//           <nav className="sidebar-nav">
//             <button className={activeTab === "general" ? "active" : ""} onClick={() => setActiveTab("general")}>
//               <User size={18} /> Profile Overview
//             </button>
//             <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
//               <Lock size={18} /> Privacy & Security
//             </button>
//             <button className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>
//               <Activity size={18} /> User Activity
//             </button>
//           </nav>
//         </aside>

//         {/* RIGHT SIDE: FEATURE-RICH CONTENT AREA */}
//         <main className="dashboard-content-area">
//           <header className="content-hero-header">
//             <div className="header-title">
//               <h1>Account Settings</h1>
//               <p>Manage your public identity and account security protocols.</p>
//             </div>
//             <div className="header-actions">
//               <button className="icon-btn-ghost"><Bell size={20} /></button>
//               <button className="icon-btn-ghost"><Share2 size={20} /></button>
//             </div>
//           </header>

//           {/* QUICK STATS CARDS */}
//           <div className="stats-dashboard-grid">
//             <div className="stat-card-pro">
//               <div className="stat-icon-wrapper blue"><Zap size={20} /></div>
//               <div className="stat-info">
//                 <span className="s-label">Trust Score</span>
//                 <span className="s-value">98.4%</span>
//               </div>
//             </div>
//             <div className="stat-card-pro">
//               <div className="stat-icon-wrapper green"><Award size={20} /></div>
//               <div className="stat-info">
//                 <span className="s-label">Reputation</span>
//                 <span className="s-value">Elite</span>
//               </div>
//             </div>
//             <div className="stat-card-pro">
//               <div className="stat-icon-wrapper purple"><Globe size={20} /></div>
//               <div className="stat-info">
//                 <span className="s-label">Region</span>
//                 <span className="s-value">Global</span>
//               </div>
//             </div>
//           </div>

//           {/* INFORMATION INPUT GRID */}
//           <div className="data-management-section">
//             <div className="section-label">Identity Metadata</div>
//             <div className="pro-input-grid">
//               <div className="pro-field">
//                 <label><User size={14}/> User Name</label>
//                 <div className="pro-box">{authUser?.fullName}</div>
//               </div>
//               <div className="pro-field">
//                 <label><Mail size={14}/> Email Address</label>
//                 <div className="pro-box">{authUser?.email}</div>
//               </div>
//               <div className="pro-field">
//                 <label><Phone size={14}/> Phone Number</label>
//                 <div className="pro-box">{authUser?.phone || "91 000000000"}</div>
//               </div>
//               <div className="pro-field">
//                 <label><Cake size={14}/> Date of Birth</label>
//                 <div className="pro-box">{authUser?.dob || "Not Provided"}</div>
//               </div>
//             </div>
//           </div>

//           {/* SECURITY HEALTH CHECK */}
//           <div className="security-banner">
//             <div className="security-info">
//               <ShieldCheck className="shield-icon-green" />
//               <div>
//                 <h4>Security Health is Optimal</h4>
//                 <p>Your account is protected by 2FA and encryption.</p>
//               </div>
//             </div>
//             <button className="btn-security-action">Audit Log</button>
//           </div>

//           <footer className="pro-dash-footer">
//             <div className="footer-meta">
//               <Calendar size={14} /> System Joined: {authUser?.createdAt?.split("T")[0]}
//             </div>
//             <div className="footer-meta">
//               <Activity size={14} /> Last Login: 2 mins ago
//             </div>
//           </footer>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;  

import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera, Mail, User, ShieldCheck, Trash2, Check, X,
  Loader2, Phone, Cake, Calendar, Power,
  Activity, Bell, Lock, Share2, Award, Zap
} from "lucide-react";
import "./styles/profilePage.css";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [pendingImg, setPendingImg] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [showNotification, setShowNotification] = useState(false);

  const triggerToast = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!pendingImg) return;
    await updateProfile({ profilepic: pendingImg });
    setPendingImg(null);
    triggerToast();
  };

  const toggleStatus = async () => {
    await updateProfile({ online: !authUser?.online });
    triggerToast();
  };

  const [imgError, setImgError] = useState(false);
  return (
    <div className="pro-dashboard-layout">
      <div className={`toast-alert ${showNotification ? "show" : ""}`}>
        <Check size={18} /> Settings Updated Successfully
      </div>

      <div className="main-glass-frame">
        <aside className="sidebar-identity">
          <div className="avatar-master-wrapper">
            <div className={`aura-ring ${authUser?.online ? "aura-active" : "aura-idle"}`}>
              {(!imgError && authUser?.profilepic && authUser.profilepic.trim() !== "") ? (

                <img
                  src={authUser.profilepic}
                  alt="profile"
                  className="profile-master-img"
                  onError={() => setImgError(true)}
                />       
                
              ) : (
                <div className="profile-master-img fallback-avatar">
                  {authUser?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              <label className="image-edit-trigger">
                <Camera size={18} />
                <input type="file" hidden onChange={handleImageSelect} />
              </label>
            </div>

            <div className="user-branding">
              <h2>
                {authUser?.fullName} <ShieldCheck size={14} className="v-icon" />
              </h2>
              <p className="user-role">Premium Member</p>
            </div>

            <div className="status-control-container">
              <button
                className={`pro-status-btn ${authUser?.online ? "online" : "offline"}`}
                onClick={toggleStatus}
              >
                <Power size={16} />
                <span>{authUser?.online ? "System Online" : "System Offline"}</span>
              </button>
            </div>

            <div className="upload-stabilizer">
              {pendingImg ? (
                <div className="upload-actions animate-pop">
                  <button onClick={handleSavePhoto} className="btn-apply">
                    {isUpdatingProfile ? <Loader2 className="spin" size={16} /> : <Check size={16} />}
                    Confirm Change
                  </button>
                  <button onClick={() => setPendingImg(null)} className="btn-deny">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                authUser?.profilepic && (
                  <button
                    className="btn-remove-soft"
                    onClick={() => updateProfile({ profilepic: null })}
                  >
                    <Trash2 size={13} /> Remove Profile Picture
                  </button>
                )
              )}
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={activeTab === "general" ? "active" : ""}
              onClick={() => setActiveTab("general")}
            >
              <User size={18} /> Profile Overview
            </button>
            <button
              className={activeTab === "security" ? "active" : ""}
              onClick={() => setActiveTab("security")}
            >
              <Lock size={18} /> Privacy & Security
            </button>
            <button
              className={activeTab === "activity" ? "active" : ""}
              onClick={() => setActiveTab("activity")}
            >
              <Activity size={18} /> User Activity
            </button>
          </nav>
        </aside>

        <main className="dashboard-content-area">
          <header className="content-hero-header">
            <div className="header-title">
              <h1>Account Settings</h1>
              <p>Manage your public identity and account security protocols.</p>
            </div>
            <div className="header-actions">
              <button className="icon-btn-ghost" onClick={triggerToast}>
                <Bell size={20} />
              </button>
              <button
                className="icon-btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/user/${authUser?._id}`
                  );
                  triggerToast();
                }}
              >
                <Share2 size={20} />
              </button>
            </div>
          </header>

          {activeTab === "general" && (
            <>
              <div className="stats-dashboard-grid">
                <div className="stat-card-pro">
                  <div className="stat-icon-wrapper blue"><Zap size={20} /></div>
                  <div className="stat-info">
                    <span className="s-label">Trust Score</span>
                    <span className="s-value">98.4%</span>
                  </div>
                </div>
                <div className="stat-card-pro">
                  <div className="stat-icon-wrapper green"><Award size={20} /></div>
                  <div className="stat-info">
                    <span className="s-label">Reputation</span>
                    <span className="s-value">Elite</span>
                  </div>
                </div>
              </div>

              <div className="data-management-section">
                <div className="section-label">Identity Metadata</div>
                <div className="pro-input-grid">
                  <div className="pro-field">
                    <label><User size={14} /> User Name</label>
                    <div className="pro-box">{authUser?.fullName}</div>
                  </div>
                  <div className="pro-field">
                    <label><Mail size={14} /> Email Address</label>
                    <div className="pro-box">{authUser?.email}</div>
                  </div>
                  <div className="pro-field">
                    <label><Phone size={14} /> Phone Number</label>
                    <div className="pro-box">{authUser?.phone || "91 000000000"}</div>
                  </div>
                  <div className="pro-field">
                    <label><Cake size={14} /> Date of Birth</label>
                    <div className="pro-box">{authUser?.dob || "Not Provided"}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <div className="security-banner">
              <div className="security-info">
                <ShieldCheck className="shield-icon-green" />
                <div>
                  <h4>Security Health is Optimal</h4>
                  <p>Your account is protected by 2FA and encryption.</p>
                </div>
              </div>
              <button className="btn-security-action" onClick={triggerToast}>
                Audit Log
              </button>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="tab-section">
              <h2>User Activity</h2>
              <div className="activity-graph">
                {[30, 60, 45, 80, 55, 90, 40].map((v, i) => (
                  <div key={i} className="bar-wrapper">
                    <div className="bar" style={{ height: `${v}%` }}></div>
                    <span>Day {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <footer className="pro-dash-footer">
            <div className="footer-meta">
              <Calendar size={14} /> System Joined: {authUser?.createdAt?.split("T")[0]}
            </div>
            <div className="footer-meta">
              <Activity size={14} /> Last Login: 2 mins ago
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;


