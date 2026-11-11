import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShieldHalved,
  FaEnvelope,
  FaKey,
  FaLock,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaPaperPlane,
} from "react-icons/fa6";
import { LuLoaderCircle, LuTriangleAlert, LuCircleCheck, LuClock } from "react-icons/lu";
import { forgotPasswordApi, verifyOtpApi, resetPasswordApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { RadarSweepPattern } from "@/components/SvgBackground";
import policeLogo from "@/assets/logo.png";

type Step = "EMAIL" | "OTP" | "NEW_PASSWORD" | "SUCCESS";

export function ForgotPassword() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // OTP Resend Countdown
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "OTP" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered official email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await forgotPasswordApi(email.trim());
      setMessage(res.message || "A 6-digit OTP verification code has been dispatched to your email via Brevo.");
      setStep("OTP");
      setResendTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to dispatch verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await verifyOtpApi(email.trim(), otp.trim());
      setMessage(res.message);
      setStep("NEW_PASSWORD");
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    setError(null);
    try {
      await forgotPasswordApi(email.trim());
      setMessage("A fresh 6-digit OTP code has been dispatched to your email.");
      setResendTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await resetPasswordApi(email.trim(), otp.trim(), newPassword);
      if (res.token && res.user) {
        setSession(res.token, res.user);
      }
      setStep("SUCCESS");
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength check
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, text: "" };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 1) return { score: 1, text: "Weak", color: "bg-red-500" };
    if (score === 2) return { score: 2, text: "Moderate", color: "bg-yellow-500" };
    if (score === 3) return { score: 3, text: "Strong", color: "bg-blue-500" };
    return { score: 4, text: "Very Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-radial from-navy-900/60 via-navy-950/90 to-navy-950 pointer-events-none" />
      <RadarSweepPattern className="opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-navy-700/80 bg-navy-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-navy-700/60 dark:bg-navy-900/95"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-accent-500 via-brand-500 to-accent-400" />

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-500/30 bg-navy-950/80 shadow-inner">
            <img src={policeLogo} alt="Police Emblem" className="h-10 w-10 object-contain" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-300">
            <FaShieldHalved size={11} /> Credential Recovery
          </span>

          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
            {step === "EMAIL" && "Reset Password"}
            {step === "OTP" && "Verify Security Code"}
            {step === "NEW_PASSWORD" && "Set New Password"}
            {step === "SUCCESS" && "Credentials Updated"}
          </h1>
          <p className="mt-1 text-xs text-navy-300">
            {step === "EMAIL" && "Enter your authorized official email to receive a 6-digit OTP."}
            {step === "OTP" && `Enter the 6-digit OTP code sent to ${email}`}
            {step === "NEW_PASSWORD" && "Create a secure, non-reused password for your account."}
            {step === "SUCCESS" && "Your password has been successfully updated and secured."}
          </p>
        </div>

        {/* Step Indicator */}
        {step !== "SUCCESS" && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {(["EMAIL", "OTP", "NEW_PASSWORD"] as Step[]).map((s, idx) => {
              const currentIdx = ["EMAIL", "OTP", "NEW_PASSWORD"].indexOf(step);
              const isActive = idx === currentIdx;
              const isPast = idx < currentIdx;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                      isPast
                        ? "bg-brand-600 text-white"
                        : isActive
                        ? "bg-accent-500 text-navy-950 font-bold shadow-md shadow-accent-500/30"
                        : "bg-navy-800 text-navy-400"
                    }`}
                  >
                    {isPast ? <FaCheck size={10} /> : idx + 1}
                  </div>
                  {idx < 2 && (
                    <div className={`h-0.5 w-6 ${isPast ? "bg-brand-600" : "bg-navy-800"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Error / Info Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200"
            >
              <LuTriangleAlert size={16} className="flex-none text-red-400 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
          {message && !error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 text-xs text-brand-200"
            >
              <LuCircleCheck size={16} className="flex-none text-brand-400 mt-0.5" />
              <span>{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 1: EMAIL */}
        {step === "EMAIL" && (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                Official Registered Email
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
                  <FaEnvelope size={14} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mppolice.gov.in"
                  className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-3 pl-10 pr-4 text-sm text-white placeholder-navy-500 transition-colors focus:border-accent-400 focus:bg-navy-950 focus:outline-none focus:ring-1 focus:ring-accent-400"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 via-brand-600 to-brand-700 py-3.5 px-4 font-display text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LuLoaderCircle size={18} className="animate-spin" />
                  <span>Dispatching OTP via Brevo...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane size={13} />
                  <span>Send Verification Code</span>
                </>
              )}
            </motion.button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === "OTP" && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300 text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="mt-2 flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-48 rounded-xl border border-navy-700 bg-navy-950/90 py-3 text-center font-mono text-2xl font-bold tracking-[0.3em] text-accent-400 placeholder-navy-600 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-navy-400">
              <span className="flex items-center gap-1">
                <LuClock size={13} /> Code valid 10 mins
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className={`font-semibold transition-colors ${
                  canResend
                    ? "text-accent-400 hover:text-accent-300 cursor-pointer"
                    : "text-navy-600 cursor-not-allowed"
                }`}
              >
                {canResend ? "Resend OTP Code" : `Resend in ${resendTimer}s`}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || otp.length !== 6}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 via-brand-600 to-brand-700 py-3.5 px-4 font-display text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LuLoaderCircle size={18} className="animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & Proceed</span>
                  <FaArrowRight size={13} />
                </>
              )}
            </motion.button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === "NEW_PASSWORD" && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                New Secure Password
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
                  <FaKey size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-3 pl-10 pr-11 text-sm text-white placeholder-navy-500 transition-colors focus:border-accent-400 focus:bg-navy-950 focus:outline-none focus:ring-1 focus:ring-accent-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-navy-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
              {/* Strength Meter */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex h-1.5 overflow-hidden rounded-full bg-navy-800">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-navy-400">
                    Strength: <span className="font-semibold text-navy-200">{strength.text}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                Confirm New Password
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
                  <FaLock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-3 pl-10 pr-4 text-sm text-white placeholder-navy-500 transition-colors focus:border-accent-400 focus:bg-navy-950 focus:outline-none focus:ring-1 focus:ring-accent-400"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !newPassword || newPassword !== confirmPassword}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 via-brand-600 to-brand-700 py-3.5 px-4 font-display text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LuLoaderCircle size={18} className="animate-spin" />
                  <span>Securing New Password...</span>
                </>
              ) : (
                <>
                  <FaCheck size={13} />
                  <span>Update & Sign In</span>
                </>
              )}
            </motion.button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "SUCCESS" && (
          <div className="mt-6 flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <LuCircleCheck size={36} />
            </div>
            <p className="text-sm text-navy-200">
              Your password has been successfully updated on <strong>{email}</strong>.
            </p>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/gallery")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 px-4 font-display text-sm font-bold text-white shadow-lg hover:bg-brand-500"
            >
              <span>Go to Admin Gallery Dashboard</span>
              <FaArrowRight size={13} />
            </motion.button>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-8 border-t border-navy-800 pt-5 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-navy-300 hover:text-white transition-colors"
          >
            <FaArrowLeft size={12} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
