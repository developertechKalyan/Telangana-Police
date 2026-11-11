import { motion, AnimatePresence } from "framer-motion";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle({ dark = true }: { dark?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  const toneClasses = dark
    ? "text-white hover:text-white hover:bg-white/10"
    : "text-navy-600 hover:text-navy-900 hover:bg-navy-100 dark:text-white dark:hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-colors ${toneClasses}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {theme === "dark" ? <LuMoon size={17} /> : <LuSun size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
