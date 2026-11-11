import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa6";
import { EMERGENCY_NUMBER } from "@/data/nav";
import { useT } from "@/contexts/LanguageContext";
import { ui } from "@/i18n/ui";

export function EmergencyButton({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const t = useT();
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }[size];

  return (
    <motion.a
      href={`tel:${EMERGENCY_NUMBER}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center gap-2 rounded-full bg-emergency-500 font-display font-semibold text-white shadow-lg shadow-emergency-500/30 ${sizeClasses} ${className}`}
    >
      <FaPhone />
      <span>
        {t(ui.emergencyButton.label)} {EMERGENCY_NUMBER}
      </span>
    </motion.a>
  );
}
