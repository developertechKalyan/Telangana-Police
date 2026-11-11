import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShieldHalved,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserShield,
  FaBuildingShield,
} from "react-icons/fa6";
import { LuLoaderCircle, LuTriangleAlert } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import policeLogo from "@/assets/logo.png";
import { RadarSweepPattern } from "@/components/SvgBackground";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to admin gallery
  const from = (location.state as any)?.from?.pathname || "/admin/gallery";
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please provide both your official email address and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid authentication credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-radial from-navy-900/60 via-navy-950/90 to-navy-950 pointer-events-none" />
      <RadarSweepPattern className="opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-navy-700/80 bg-navy-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-navy-700/60 dark:bg-navy-900/95"
      >
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-accent-500 via-brand-500 to-accent-400" />

        {/* Security Badge Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent-500/30 bg-navy-950/80 shadow-inner">
            <img src={policeLogo} alt="Police Emblem" className="h-12 w-12 object-contain" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border border-accent-400/20"
            />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-300">
            <FaShieldHalved size={11} /> Authorized Personnel Only
          </span>

          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Police Control Portal
          </h1>
          <p className="mt-1 text-xs text-navy-300">
            Official Dial 112 Media & Gallery Command Authentication
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-200"
            >
              <LuTriangleAlert size={16} className="flex-none text-red-400 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
              Official Email Address
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
                placeholder="officer@mppolice.gov.in"
                autoComplete="email"
                className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-3 pl-10 pr-4 text-sm text-white placeholder-navy-500 transition-colors focus:border-accent-400 focus:bg-navy-950 focus:outline-none focus:ring-1 focus:ring-accent-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                Secure Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-accent-400 transition-colors hover:text-accent-300"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative mt-1.5 rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
                <FaLock size={14} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-navy-700 bg-navy-950/80 py-3 pl-10 pr-11 text-sm text-white placeholder-navy-500 transition-colors focus:border-accent-400 focus:bg-navy-950 focus:outline-none focus:ring-1 focus:ring-accent-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-navy-400 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 via-brand-600 to-brand-700 py-3.5 px-4 font-display text-sm font-bold text-white shadow-lg shadow-brand-900/40 transition-all hover:opacity-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <LuLoaderCircle size={18} className="animate-spin" />
                <span>Authenticating Officer...</span>
              </>
            ) : (
              <>
                <span>Secure Sign In</span>
                <FaArrowRight size={13} />
              </>
            )}
          </motion.button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 rounded-xl border border-navy-800 bg-navy-950/60 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-navy-300">
            <FaUserShield size={14} className="text-accent-400" />
            <span>Restricted Government System</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-navy-400">
            Public user registration is disabled. Administrator accounts are provisioned directly by department heads.
          </p>
        </div>

        {/* Footer Security Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-navy-400">
          <span className="flex items-center gap-1">
            <FaBuildingShield size={11} className="text-brand-400" /> 256-Bit Encrypted
          </span>
          <span>•</span>
          <span>IP Monitored</span>
          <span>•</span>
          <span>ERSS 112</span>
        </div>
      </motion.div>
    </div>
  );
}
