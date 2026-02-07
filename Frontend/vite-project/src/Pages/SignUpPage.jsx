



import { useState } from "react";
import { Eye, EyeOff, MessageSquare, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import "./SignUp.css"; 

/*
  Password rules:
  - Minimum 6 characters (any type)
*/
const PASSWORD_REGEX = /^.{6,}$/;


import { useAuthStore } from "../store/useAuthStore";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic frontend validation
    if (!form.fullName || !form.username || !form.email || !form.password) {
      setMessage("❌ All fields are required");
      return;
    }

    if (!PASSWORD_REGEX.test(form.password)) {
      setMessage(
        "❌ Password must be at least 6 characters"
      );
      return;
    }

    try {
      await signup(form);
      // Only show success if authUser is set (signup succeeded)
      if (useAuthStore.getState().authUser) {
        setMessage("🎉 Account created successfully");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      // Show backend error if available
      if (error?.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage("❌ Signup failed");
      }
    }
  };

  return (
    <div className="signup-page">
      {/* LEFT */}
      <div className="signup-left">
        <div className="signup-card">
          {/* TOP BAR */}
          <div className="signup-top">
            <div className="brand">
              <MessageSquare size={22} />
              <span>ChatApp</span>
            </div>
            <Bell size={18} />
          </div>

          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Happy to see you 👋</p>

          <form onSubmit={handleSubmit} className="signup-form">
            <input
              className="signup-input"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
            <input
              className="signup-input"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
            <input
              className="signup-input"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            {/* PASSWORD */}
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                className="signup-input"
                placeholder="Password (6+ chars)"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="remember-row">
              <label>
                <input type="checkbox" />
                <span>Save password</span>
              </label>
            </div>
            {message && <p className="info-text">{message}</p>}
            <button type="submit" className="signup-button" disabled={isSigningUp}>
              {isSigningUp ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* 🔴 SIGN IN LINK (NOT LOGIN) */}
          <p className="signup-footer">
            Already have an account?{" "}
            <Link to="/login" className="signin-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="signup-right">
        <div className="dashboard-blink">
          <h2>Chat Dashboard</h2>
          <p>Live • Secure • Fast</p>

          <div className="blink-chat">
            <span className="dot"></span>
            <span>New message received…</span>
          </div>

          <div className="blink-chat">
            <span className="dot"></span>
            <span>User typing…</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
