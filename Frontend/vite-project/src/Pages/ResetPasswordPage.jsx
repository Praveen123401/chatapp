import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Lock, KeyRound } from "lucide-react";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Block direct access
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const resetPassword = async () => {
    if (!otp || !newPassword) {
      toast.error("OTP and new password required");
      return;
    }

    try {
      setLoading(true);
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="w-full max-w-md bg-base-100 rounded-2xl p-8 shadow-2xl space-y-6">

        <div className="text-center">
          <KeyRound className="mx-auto text-primary" size={36} />
          <h2 className="text-2xl font-bold mt-2">Reset Password</h2>
          <p className="text-sm text-base-content/60">
            OTP valid for 2 minutes
          </p>
        </div>

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="password"
            className="input input-bordered w-full pl-10"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-success w-full"
          onClick={resetPassword}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP & Reset"}
        </button>

        <Link
          to="/forgot-password"
          className="block text-center text-sm link link-primary"
        >
          Resend OTP
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
