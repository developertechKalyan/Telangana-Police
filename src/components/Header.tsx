import { useState, useEffect, useRef } from "react";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiBars3, HiXMark } from "react-icons/hi2";
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaYoutube,
  FaPhone,
} from "react-icons/fa6";
import {
  LuChevronDown,
  LuChevronRight,
  LuPhoneCall,
  LuShieldAlert,
  LuActivity,
  LuMapPin,
  LuFileText,
  LuShieldCheck,
  LuRadio,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import { navLinks, socialLinks, EMERGENCY_NUMBER } from "@/data/nav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, useT } from "@/contexts/LanguageContext";
import { ui } from "@/i18n/ui";
import type { NavLink } from "@/types/content";
import homelogo from "@/assets/dial100.png";

const socialIconMap = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  youtube: FaYoutube,
};

const GET_HELP_METADATA: Record<
  string,
  {
    icon: IconType;
    iconColor: string;
    iconBg: string;
    subtitles: Record<string, string>;
  }
> = {
  "/reach-us": {
    icon: LuPhoneCall,
    iconColor: "text-blue-500 dark:text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/25",
    subtitles: {
      en: "Direct lines, SMS & WhatsApp",
      hi: "आपातकालीन नंबर, एसएमएस और व्हाट्सएप",
      te: "అత్యవసర లైన్లు, SMS & వాట్సాప్",
      gu: "કટોકટી લાઇનો, એસએમએસ અને વોટ્સએપ",
      ur: "ایمرجنسی لائنیں، ایس ایم ایس اور واٹس ایپ",
      sd: "ايمرجنسي لائينون، ايس ايم ايس ۽ واٽس اپ",
    },
  },
  "/when-to-call": {
    icon: LuShieldAlert,
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/25",
    subtitles: {
      en: "Triage criteria & critical cases",
      hi: "वर्गीकरण मानदंड और आपात स्थिति",
      te: "వర్గీకరణ ప్రమాణాలు & కీలక కేసులు",
      gu: "વર્ગીકરણ માપદંડ અને કટોકટી",
      ur: "ترجیحی معیار اور ہنگامی حالات",
      sd: "ترجيحي معيار ۽ ھنگامي حالتون",
    },
  },
  "/what-happens": {
    icon: LuActivity,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/25",
    subtitles: {
      en: "CAD dispatch & response cycle",
      hi: "सीएडी प्रेषण और प्रतिक्रिया चक्र",
      te: "CAD డిస్పాచ్ & ప్రతిస్పందన చక్రం",
      gu: "સીએડી રવાનગી અને પ્રતિભાવ ચક્ર",
      ur: "سی اے ڈی ڈسپیچ اور رسپانس سائیکل",
      sd: "سي اي ڊي موڪل ۽ جوابي چڪر",
    },
  },
  "/find-you": {
    icon: LuMapPin,
    iconColor: "text-cyan-500 dark:text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/25",
    subtitles: {
      en: "GPS & CAD location tools",
      hi: "जीपीएस और सटीक स्थान उपकरण",
      te: "GPS & ఖచ్చితమైన స్థాన సాధనాలు",
      gu: "જીપીએસ અને ચોક્કસ સ્થાન સાધનો",
      ur: "جی پی ایس اور درست مقام کے اوزار",
      sd: "جي پي ايس ۽ صحيح جڳھ جا اوزار",
    },
  },
  "/resources": {
    icon: LuFileText,
    iconColor: "text-purple-500 dark:text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/25",
    subtitles: {
      en: "Handbooks, helplines & downloads",
      hi: "सुरक्षा पुस्तिकाएं और हेल्पलाइन",
      te: "హ్యాండ్‌బుక్‌లు, హెల్ప్‌లైన్‌లు & డౌన్‌లోడ్‌లు",
      gu: "સલામતી પુસ્તિકા અને હેલ્પલાઇન",
      ur: "حفاظتی کتابچے اور ہیلप لائنز",
      sd: "حفاظتي ڪتابچا ۽ ھيلپ لائينون",
    },
  },
};

const MEGA_MENU_HEADER = {
  en: "Emergency & Citizen Services",
  hi: "आपातकालीन एवं नागरिक सेवाएं",
  te: "అత్యవసర & పౌర సేవలు",
  gu: "કટોકટી અને નાગરિક સેવાઓ",
  ur: "ایمرجنسی اور شہری خدمات",
  sd: "ايمرجنسي ۽ شهري خدمتون",
};

const MEGA_MENU_FOOTER = {
  en: "In immediate danger? Call 112 immediately — toll-free & 24/7",
  hi: "तत्काल खतरे में हैं? 112 पर तुरंत कॉल करें — 24/7 निःशुल्क",
  te: "తక్షణ ప్రమాదంలో ఉన్నారా? వెంటనే 112కు కాల్ చేయండి — 24/7 ఉచితం",
  gu: "તાત્કાલિક જોખમમાં છો? તરત જ 112 પર કૉલ કરો — 24/7 નિઃશુલ્ક",
  ur: "فوری خطرے میں ہیں؟ فوری طور پر 112 پر کال کریں — 24/7 مفت",
  sd: "فوري خطري ۾ آھيو؟ فوري طور 112 تي ڪال ڪريو — 24/7 مفت",
};

function TopBar({
  visible,
  isDark,
}: {
  visible: boolean;
  isDark: boolean;
}) {
  const t = useT();

  return (
    <div
      className={`hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out sm:block ${
        visible ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
      } ${
        isDark
          ? "border-b border-white/[0.08] bg-navy-950/60 backdrop-blur-md text-white"
          : "border-b border-navy-200/50 bg-white/80 backdrop-blur-md text-navy-800"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
        {/* Left: 24/7 Live Status & Emergency Notice */}
        <div className="flex items-center gap-2 flex-1 justify-start">
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-mono font-semibold tracking-wider ${
              isDark
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-emerald-600/30 bg-emerald-50 text-emerald-700"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span>24x7 ACTIVE</span>
          </div>

          <a
            href={`tel:${EMERGENCY_NUMBER}`}
            className={`group flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium transition-colors ${
              isDark
                ? "text-white/85 hover:text-white"
                : "text-navy-700 hover:text-navy-950"
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emergency-500/20 text-emergency-500 transition-transform group-hover:scale-110">
              <FaPhone size={8} />
            </span>
            <span>{t(ui.topBar.notice)}</span>
          </a>
        </div>

        {/* Center Spacer: Leaves Room for the Big Overlapping Logo */}
        <div className="w-24 sm:w-28 lg:w-32 shrink-0 hidden sm:block" />

        {/* Right: Social Connect Hub */}
        <div
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 flex-1 justify-end ${
            isDark
              ? "border-white/[0.08] bg-white/[0.03]"
              : "border-navy-200/60 bg-navy-50/70"
          }`}
        >
          {socialLinks.map((social) => {
            const Icon = socialIconMap[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={`flex h-5.5 w-5.5 items-center justify-center rounded-full transition-all duration-200 ${
                  isDark
                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                    : "text-navy-600 hover:bg-navy-200/50 hover:text-navy-950"
                }`}
              >
                <Icon size={11} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NavDropdown({
  link,
  isDark,
}: {
  link: NavLink;
  isDark: boolean;
}) {
  const t = useT();
  const { locale } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = link.children?.some((child) => location.pathname === child.path) ?? false;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium transition-all duration-200 ${
          isActive
            ? isDark
              ? "bg-white/15 text-white"
              : "bg-navy-100 text-navy-950 font-semibold"
            : isDark
            ? "text-white/85 hover:bg-white/10 hover:text-white"
            : "text-navy-700 hover:bg-navy-100/70 hover:text-navy-950"
        }`}
      >
        <span>{t(link.label)}</span>
        <LuChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            open ? "rotate-180 text-accent-400" : isDark ? "text-white/80" : "text-navy-500"
          }`}
        />
        {isActive && (
          <span className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-500 shadow-[0_0_6px_rgba(255,107,0,0.9)]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute top-full left-1/2 mt-2 -translate-x-1/2 w-[500px] rounded-3xl border p-4 shadow-2xl backdrop-blur-2xl ${
              isDark
                ? "border-white/10 bg-navy-950/95 text-white ring-1 ring-white/10 shadow-black/80"
                : "border-navy-200 bg-white/98 text-navy-900 ring-1 ring-black/5 shadow-navy-950/15"
            }`}
          >
            {/* Header Badge */}
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDark ? "border-white/10" : "border-navy-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isDark ? "bg-brand-500/20 text-brand-400" : "bg-brand-50 text-brand-600"
                  }`}
                >
                  <LuShieldCheck size={16} />
                </span>
                <span
                  className={`text-xs font-bold tracking-wider uppercase ${
                    isDark ? "text-white" : "text-navy-900"
                  }`}
                >
                  {MEGA_MENU_HEADER[locale as keyof typeof MEGA_MENU_HEADER] || MEGA_MENU_HEADER.en}
                </span>
              </div>
              <span
                className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold ${
                  isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                ACTIVE
              </span>
            </div>

            {/* Menu Items Grid */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {link.children?.map((child) => {
                const meta = GET_HELP_METADATA[child.path];
                const Icon = meta?.icon || LuRadio;
                const subtitle = meta?.subtitles[locale] || meta?.subtitles.en || "";

                return (
                  <RouterNavLink
                    key={child.path}
                    to={child.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive: childActive }) =>
                      `group relative flex items-start gap-3 rounded-2xl p-2.5 transition-all duration-200 ${
                        childActive
                          ? isDark
                            ? "bg-brand-500/20 border border-brand-500/30 text-white"
                            : "bg-brand-50 border border-brand-200 text-brand-700"
                          : isDark
                          ? "hover:bg-white/[0.08] text-white/90 hover:text-white"
                          : "hover:bg-navy-50 text-navy-800 hover:text-navy-950"
                      }`
                    }
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${
                        meta?.iconBg || "bg-brand-500/10 border-brand-500/20"
                      } ${meta?.iconColor || "text-brand-400"}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="truncate text-xs font-semibold">{t(child.label)}</p>
                        <LuChevronRight
                          size={13}
                          className={`shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 ${
                            isDark ? "text-white/40" : "text-navy-400"
                          }`}
                        />
                      </div>
                      <p
                        className={`mt-0.5 truncate text-[11px] ${
                          isDark ? "text-white/60" : "text-navy-500"
                        }`}
                      >
                        {subtitle}
                      </p>
                    </div>
                  </RouterNavLink>
                );
              })}
            </div>

            {/* Footer Quick CTA */}
            <div
              className={`mt-3 flex items-center justify-between rounded-2xl border px-3 py-2 ${
                isDark
                  ? "border-emergency-500/20 bg-emergency-500/10 text-emergency-300"
                  : "border-emergency-500/30 bg-emergency-50 text-emergency-700"
              }`}
            >
              <span className="text-[11px] font-medium">
                {MEGA_MENU_FOOTER[locale as keyof typeof MEGA_MENU_FOOTER] || MEGA_MENU_FOOTER.en}
              </span>
              <a
                href={`tel:${EMERGENCY_NUMBER}`}
                className="flex items-center gap-1.5 rounded-full bg-emergency-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md shadow-emergency-500/25 transition-transform hover:scale-105"
              >
                <FaPhone size={9} />
                <span>112</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavItem({
  link,
  isDark,
  onNavigate,
}: {
  link: NavLink;
  isDark: boolean;
  onNavigate: () => void;
}) {
  const t = useT();
  const { locale } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!link.children) {
    return (
      <RouterNavLink
        to={link.path}
        end={link.path === "/"}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            isActive
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
              : isDark
              ? "text-white/90 hover:bg-white/10 hover:text-white"
              : "text-navy-800 hover:bg-navy-100 hover:text-navy-950"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span>{t(link.label)}</span>
            {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
          </>
        )}
      </RouterNavLink>
    );
  }

  const isActive = link.children.some((child) => location.pathname === child.path);

  return (
    <div
      className={`rounded-xl border ${
        isDark ? "border-white/10 bg-white/[0.04]" : "border-navy-200 bg-navy-50/50"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
          isActive
            ? "text-brand-500 font-bold"
            : isDark
            ? "text-white"
            : "text-navy-800"
        }`}
      >
        <span className="flex items-center gap-2">
          <span>{t(link.label)}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
              isDark ? "bg-brand-500/20 text-brand-300" : "bg-brand-100 text-brand-700"
            }`}
          >
            {link.children.length}
          </span>
        </span>
        <LuChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            open ? "rotate-180 text-brand-500" : isDark ? "text-white/80" : "text-navy-500"
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`overflow-hidden border-t px-2 pb-2 pt-1.5 ${
              isDark ? "border-white/10" : "border-navy-200"
            }`}
          >
            {link.children.map((child) => {
              const meta = GET_HELP_METADATA[child.path];
              const Icon = meta?.icon || LuRadio;
              const subtitle = meta?.subtitles[locale] || meta?.subtitles.en || "";

              return (
                <RouterNavLink
                  key={child.path}
                  to={child.path}
                  onClick={onNavigate}
                  className={({ isActive: childActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-colors ${
                      childActive
                        ? "bg-brand-600 text-white font-medium shadow-sm"
                        : isDark
                        ? "text-white/80 hover:bg-white/10 hover:text-white"
                        : "text-navy-700 hover:bg-navy-100 hover:text-navy-950"
                    }`
                  }
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      isDark ? "bg-white/10 text-white" : "bg-navy-100 text-navy-700"
                    }`}
                  >
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{t(child.label)}</p>
                    <p className={`truncate text-[10px] ${isDark ? "text-white/60" : "text-navy-500"}`}>
                      {subtitle}
                    </p>
                  </div>
                </RouterNavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useT();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 16);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  // Split navigation: 
  // Left: Home, Dial 112, Services, Get Help (indices 0..3)
  // Right: Gallery, Contact (indices 4..5) + LanguageSwitcher + ThemeToggle
  const leftLinks = navLinks.slice(0, 4);
  const rightLinks = navLinks.slice(4);

  return (
    <div className="fixed top-0 z-50 w-full select-none">
      {/* Unified Main Glass Header Wrapping TopBar and Main Navigation */}
      <header
        className={`relative transition-all duration-300 ${
          isDark
            ? scrolled
              ? "border-b border-white/10 bg-navy-950/90 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-white"
              : "border-b border-white/[0.08] bg-navy-950/50 backdrop-blur-md text-white"
            : scrolled
            ? "border-b border-navy-200/60 bg-white/90 shadow-[0_10px_30px_-8px_rgba(0,10,30,0.08)] backdrop-blur-2xl text-navy-900"
            : "border-b border-navy-200/40 bg-white/80 shadow-xs backdrop-blur-md text-navy-900"
        }`}
      >
        {/* Top Banner with Ticker & Socials */}
        <TopBar visible={!scrolled} isDark={isDark} />

        {/* Main Nav Bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          
          {/* ================= DESKTOP LEFT OPTIONS ================= */}
          <nav
            className="hidden items-center gap-1 lg:flex flex-1 justify-start"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {leftLinks.map((link) => {
              if (link.children) {
                return (
                  <NavDropdown
                    key={link.path}
                    link={link}
                    isDark={isDark}
                  />
                );
              }

              return (
                <RouterNavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onMouseEnter={() => setHoveredNav(link.path)}
                  className={({ isActive }) =>
                    `relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-200 ${
                      isActive
                        ? isDark
                          ? "bg-white/15 text-white"
                          : "bg-navy-100 text-navy-950 font-semibold"
                        : isDark
                        ? "text-white/85 hover:bg-white/10 hover:text-white"
                        : "text-navy-700 hover:bg-navy-100/70 hover:text-navy-950"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Interactive Hover Pill */}
                      {hoveredNav === link.path && !isActive && (
                        <motion.div
                          layoutId="nav-hover-pill"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
                          className={`absolute inset-0 rounded-full ${
                            isDark ? "bg-white/10" : "bg-navy-100/60"
                          }`}
                        />
                      )}

                      <span className="relative z-10">{t(link.label)}</span>

                      {/* Active Orange Beacon Dot */}
                      {isActive && (
                        <span className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-500 shadow-[0_0_6px_rgba(255,107,0,0.9)]" />
                      )}
                    </>
                  )}
                </RouterNavLink>
              );
            })}
          </nav>

          {/* ================= CENTER SPACER FOR EMBLEM ================= */}
          <div className="w-24 sm:w-28 lg:w-32 shrink-0 flex items-center justify-center">
            {/* Spacer allows left & right navigation to stay separated cleanly */}
          </div>

          {/* ================= DESKTOP RIGHT OPTIONS ================= */}
          <nav
            className="hidden items-center gap-1 lg:flex flex-1 justify-end"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {rightLinks.map((link) => (
              <RouterNavLink
                key={link.path}
                to={link.path}
                onMouseEnter={() => setHoveredNav(link.path)}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-200 ${
                    isActive
                      ? isDark
                        ? "bg-white/15 text-white"
                        : "bg-navy-100 text-navy-950 font-semibold"
                      : isDark
                      ? "text-white/85 hover:bg-white/10 hover:text-white"
                      : "text-navy-700 hover:bg-navy-100/70 hover:text-navy-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Interactive Hover Pill */}
                    {hoveredNav === link.path && !isActive && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
                        className={`absolute inset-0 rounded-full ${
                          isDark ? "bg-white/10" : "bg-navy-100/60"
                        }`}
                      />
                    )}

                    <span className="relative z-10">{t(link.label)}</span>

                    {/* Active Orange Beacon Dot */}
                    {isActive && (
                      <span className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-500 shadow-[0_0_6px_rgba(255,107,0,0.9)]" />
                    )}
                  </>
                )}
              </RouterNavLink>
            ))}

            {/* Language Switcher & Theme Toggle responding to Dark/Light Mode */}
            <div className="ml-1 flex items-center gap-1 pl-2">
              <LanguageSwitcher dark={isDark} />
              <ThemeToggle dark={isDark} />
            </div>
          </nav>

          {/* ================= MOBILE CONTROLS ================= */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                isDark
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-navy-100 text-navy-900 hover:bg-navy-200"
              }`}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <HiXMark size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <HiBars3 size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>

        {/* ================= FULL HEIGHT CENTER LOGO ================= */}
        {/* Covers both top bar height and header height, perfectly centered */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex items-center justify-center">
          <Link
            to="/"
            className="pointer-events-auto group relative flex items-center justify-center transition-transform duration-300 hover:scale-105"
            aria-label="Telangana Police Dial 112 Home"
          >
            <div
              className={`relative flex items-center justify-center rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-2xl transition-all duration-300 group-hover:scale-105 ${
                !scrolled
                  ? "h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                  : "h-14 w-14 sm:h-16 sm:w-16"
              } ${
                isDark
                  ? "bg-gradient-to-br from-white/95 to-white/80 ring-2 ring-white/60 shadow-black/50 group-hover:ring-accent-400"
                  : "bg-white ring-2 ring-navy-200/80 shadow-navy-950/15 group-hover:ring-brand-500"
              }`}
            >
              <img
                src={homelogo}
                alt="Telangana Police Dial 100/112 Emblem"
                className="h-full w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-accent-500/20 to-brand-500/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </Link>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`overflow-hidden border-b shadow-2xl backdrop-blur-2xl lg:hidden ${
                isDark
                  ? "border-white/10 bg-navy-950/95 text-white"
                  : "border-navy-200 bg-white/98 text-navy-900"
              }`}
            >
              <div className="flex flex-col gap-2.5 px-4 pt-3 pb-6">
                {/* Mobile Links */}
                <div className="flex flex-col gap-1.5 pt-1">
                  {navLinks.map((link) => (
                    <MobileNavItem
                      key={link.path}
                      link={link}
                      isDark={isDark}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </div>

                {/* Mobile Utilities Bar */}
                <div
                  className={`mt-2 flex items-center justify-between rounded-2xl border p-3 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-white"
                      : "border-navy-200 bg-navy-50/70 text-navy-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher dark={isDark} />
                    <ThemeToggle dark={isDark} />
                  </div>

                  {/* Social links on mobile */}
                  <div className="flex items-center gap-1.5">
                    {socialLinks.map((social) => {
                      const Icon = socialIconMap[social.icon];
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={social.label}
                          className={`flex h-8 w-8 items-center justify-center rounded-full shadow-xs transition-colors ${
                            isDark
                              ? "bg-white/10 text-white hover:bg-white/20"
                              : "bg-white text-navy-700 hover:bg-navy-100"
                          }`}
                        >
                          <Icon size={14} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
