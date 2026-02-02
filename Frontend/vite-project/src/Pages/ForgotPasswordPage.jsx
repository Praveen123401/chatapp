import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react"; 
import "./styles/ForgotPasswordPage.css";


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      toast.success("OTP sent (valid for 2 minutes)");

      // 👉 navigate to reset page WITH email
      navigate("/reset-password", { state: { email } });
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="w-full max-w-md bg-base-100 rounded-2xl p-8 shadow-2xl space-y-6">

        <div className="text-center">
          <ShieldCheck className="mx-auto text-primary" size={36} />
          <h2 className="text-2xl font-bold mt-2">Forgot Password</h2>
          <p className="text-sm text-base-content/60">
            Enter your email to receive OTP
          </p>
        </div>

        <div className="form-control">
          <label className="label">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="email"
              className="input input-bordered w-full pl-10"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-primary w-full"
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <Link to="/login" className="block text-center text-sm link link-primary">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
