import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  FaCarBurst,
  FaChildReaching,
  FaPersonCircleExclamation,
  FaShieldHalved,
  FaMotorcycle,
  FaHeadset,
  FaMicrochip,
  FaArrowRight,
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaYoutube,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPhone,
  FaCommentSms,
  FaMobileScreenButton,
  FaWhatsapp,
  FaRobot,
} from "react-icons/fa6";
import {
  LuVolume2,
  LuVolumeX,
  LuPhoneCall,
  LuX,
} from "react-icons/lu";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { StatCard } from "@/components/ui/StatCard";
import { RadarSweepPattern, SignalWavesPattern } from "@/components/SvgBackground";
import { useCountUp } from "@/hooks/useCountUp";
import { impactStats, decadeStats, dailyStats } from "@/data/stats";
import { leadership } from "@/data/leadership";
import { fleetStats } from "@/data/fleet";
import { galleryItems as staticGalleryItems } from "@/data/gallery";
import { fetchGalleryItems } from "@/lib/api";
import type { GalleryItem } from "@/types/content";
import { situations } from "@/data/situations";
import { socialLinks, EMERGENCY_NUMBER } from "@/data/nav";
import { useT } from "@/contexts/LanguageContext";
import { ui } from "@/i18n/ui";

import policeLogo from "@/assets/logo.png";
import heroVideo from "@/assets/videos/English_Dial 112_Sub_01.mp4";

const impactIcons = [FaShieldHalved, FaCarBurst, FaChildReaching, FaPersonCircleExclamation];

const CHANNEL_STRIP = [
  { icon: FaPhone, label: "Call", href: `tel:${EMERGENCY_NUMBER}` },
  { icon: FaCommentSms, label: "SMS", href: `sms:${EMERGENCY_NUMBER}` },
  { icon: FaWhatsapp, label: "WhatsApp" },
  { icon: FaRobot, label: "Chatbot" },
  { icon: FaMobileScreenButton, label: "App" },
];

const flipItem: Variants = {
  hidden: { opacity: 0, rotateY: -100 },
  visible: {
    opacity: 1,
    rotateY: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};
const fleetIcons = [FaCarBurst, FaMotorcycle, FaHeadset, FaMicrochip];
const socialIconMap = { instagram: FaInstagram, facebook: FaFacebook, twitter: FaXTwitter, youtube: FaYoutube };

function DecadeStatBlock({ stat }: { stat: (typeof decadeStats)[number] }) {
  const t = useT();
  const { ref, formatted } = useCountUp(stat.total);
  return (
    <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-navy-100">
          <LuPhoneCall size={14} className="flex-none text-accent-400" />
          {t(stat.label)}
        </p>
        <span className="flex-none rounded-full border border-accent-500/40 bg-accent-500/10 text-white px-2.5 py-1 font-mono text-[11px] font-semibold whitespace-nowrap text-accent-300">
         <span ref={ref}>{formatted}</span>
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-navy-900/70 px-2 py-2.5 text-center">
          <p className="font-mono text-sm font-bold text-accent-400">{stat.thisMonth.toLocaleString("en-IN")}</p>
          <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-navy-400">{t(ui.home.thisMonth)}</p>
        </div>
        <div className="rounded-xl bg-navy-900/70 px-2 py-2.5 text-center">
          <p className="font-mono text-sm font-bold text-accent-400">{stat.last24h.toLocaleString("en-IN")}</p>
          <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-navy-400">{t(ui.home.last24h)}</p>
        </div>
        <div className="rounded-xl bg-navy-900/70 px-2 py-2.5 text-center">
          <p className="font-mono text-sm font-bold text-navy-200">{stat.updated}</p>
          <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-navy-400">{t(ui.home.updated)}</p>
        </div>
      </div>
    </div>
  );
}

function DailyStatRow({ stat }: { stat: (typeof dailyStats)[number] }) {
  const t = useT();
  const malePct = Math.round((stat.male / stat.total) * 100) || 0;
  const femalePct = 100 - malePct;
  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-baseline justify-between">
        <p className="font-medium text-navy-800 dark:text-navy-100">{t(stat.label)}</p>
        <p className="font-mono text-sm text-navy-500 dark:text-navy-400">{stat.total.toLocaleString("en-IN")}</p>
      </div>
      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-700">
        <motion.div
          className="bg-brand-600"
          initial={{ width: 0 }}
          whileInView={{ width: `${malePct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <motion.div
          className="bg-accent-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${femalePct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-navy-500 dark:text-navy-400">
        <span>M {malePct}%</span>
        <span>F {femalePct}%</span>
      </div>
    </div>
  );
}

function VideoHero() {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  // React doesn't reliably apply the `muted` attribute, and browsers block
  // autoplay unless the video is muted, so set it on the element directly.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  return (
    <section className="relative h-screen overflow-hidden bg-navy-900">
      {!videoFailed && (
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-navy-950/50" />

      <div className="relative flex h-full flex-col items-start justify-end px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <MotionSection>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
              {t(ui.home.heroKicker)}
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {t(ui.home.heroTitle)}
            </h2>
          </MotionSection>
        </div>
      </div>

      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-navy-950/60 text-white backdrop-blur transition-colors hover:bg-navy-950/80 sm:bottom-6 sm:right-6"
      >
        {muted ? <LuVolumeX size={18} /> : <LuVolume2 size={18} />}
      </button>
    </section>
  );
}

function LeaderCard({ leader, className = "" }: { leader: (typeof leadership)[number]; className?: string }) {
  const t = useT();

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border-b-4 border-navy-800 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl dark:border-accent-500 dark:bg-navy-800 ${className}`}
    >
      {/* Photo */}
      <div className="aspect-[22/21] w-full overflow-hidden bg-navy-100 dark:bg-navy-700">
        {leader.image ? (
          <img
            src={leader.image}
            alt={leader.name}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-navy-800 to-navy-950">
            <span className="font-display text-5xl font-bold text-navy-300">{leader.initials}</span>
          </div>
        )}
      </div>

      {/* Name & title */}
      <div className="flex flex-1 flex-col items-center px-6 pt-8 pb-10 text-center">
        <h3 className="font-display text-xl leading-snug font-bold text-navy-800 dark:text-navy-50">{leader.name}</h3>
        <p className="mt-3 text-sm tracking-wide text-navy-500 dark:text-navy-300">{t(leader.title)}</p>
      </div>
    </motion.div>
  );
}

const TELANGANA_POLICE_YOUTUBE_URL = socialLinks.find((s) => s.icon === "youtube")?.href ?? "https://www.youtube.com/@112-Telangana";

function ShortsVideoCard() {
  return (
    <a
      href={TELANGANA_POLICE_YOUTUBE_URL}
      target="_blank"
      rel="noreferrer"
      className="group relative mx-auto flex aspect-9/16 w-64 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-navy-950 shadow-2xl ring-1 ring-white/10 sm:w-72"
    >
      <RadarSweepPattern className="opacity-60" />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
        <FaYoutube size={28} />
      </span>
      <p className="relative px-6 text-center font-display text-sm font-semibold text-white">Watch on YouTube</p>
      <p className="relative px-6 text-center text-xs text-navy-400">@112-Telangana</p>
    </a>
  );
}

const SOCIAL_CARD_META: Record<
  keyof typeof socialIconMap,
  { accent: string; handle: string; button: string; cta: string }
> = {
  facebook: { accent: "text-[#1877F2]", handle: "dgptelangana", button: "bg-[#1877F2]", cta: "Follow Page" },
  instagram: {
    accent: "text-[#E1306C]",
    handle: "112telangana",
    button: "bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    cta: "View Profile",
  },
  twitter: { accent: "text-navy-900 dark:text-white", handle: "@112Telangana", button: "bg-navy-900 dark:bg-black", cta: "Follow" },
  youtube: { accent: "text-[#FF0000]", handle: "112-Telangana", button: "bg-[#FF0000]", cta: "Subscribe" },
};

function SocialPreviewCard({ social }: { social: (typeof socialLinks)[number] & { icon: keyof typeof socialIconMap } }) {
  const Icon = socialIconMap[social.icon];
  const meta = SOCIAL_CARD_META[social.icon];
  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noreferrer"
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white text-left shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800"
    >
      <div className="flex items-center gap-2 border-b border-navy-100 px-4 py-3 dark:border-navy-700">
        <Icon size={16} className={meta.accent} />
        <span className="text-sm font-semibold text-navy-800 dark:text-navy-100">{social.label}</span>
      </div>
      <div className="flex flex-1 flex-col items-center gap-3 p-6 text-center">
        <img
          src={policeLogo}
          alt=""
          className="h-12 w-12 rounded-full border border-navy-100 bg-white object-contain p-1 dark:border-navy-700"
        />
        <div>
          <p className="font-display text-sm font-semibold text-navy-900 dark:text-navy-50">{meta.handle}</p>
          <p className="text-xs text-navy-400">Telangana Police Dial 112</p>
        </div>
        <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white ${meta.button}`}>
          {meta.cta}
        </span>
      </div>
    </motion.a>
  );
}

type CarouselDims = { spacingX: number; depthZ: number; curveY: number; rotateAmt: number };

function carouselDimsFor(width: number): CarouselDims {
  if (width <= 640) return { spacingX: 130, depthZ: 110, curveY: 8, rotateAmt: 26 };
  if (width <= 1024) return { spacingX: 170, depthZ: 140, curveY: 12, rotateAmt: 20 };
  return { spacingX: 220, depthZ: 180, curveY: 16, rotateAmt: 16 };
}

function getYouTubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

/** Poster image for a gallery item; "" when the item has nothing renderable (used to drop blank cards). */
function galleryThumb(item: GalleryItem): string {
  if (!item?.src) return "";
  if (item.type === "video") {
    const id = getYouTubeId(item.src);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  }
  return item.src;
}

/** Draggable/scroll/keyboard 3D coverflow — items sit on a circular index and lerp toward a target each frame. */
function GalleryCarousel({ items: rawItems }: { items: GalleryItem[] }) {
  const t = useT();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const stateRef = useRef({ target: 0, current: 0, dragging: false, startX: 0, dragStartTarget: 0, hovered: false, moved: false });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [brokenIds, setBrokenIds] = useState<Set<GalleryItem["id"]>>(() => new Set());

  // Only keep cards that actually have a poster and haven't failed to load — no empty boxes in the loop.
  const items = useMemo(
    () => rawItems.filter((item) => galleryThumb(item) !== "" && !brokenIds.has(item.id)),
    [rawItems, brokenIds],
  );

  const total = items.length;
  const active = lightboxIndex !== null ? items[lightboxIndex] ?? null : null;
  const activeYouTubeId = active?.type === "video" ? getYouTubeId(active.src) : null;

  useEffect(() => {
    if (lightboxIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? null : (i - 1 + total) % total));
      else if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? null : (i + 1) % total));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, total]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || total === 0) return;

    const state = stateRef.current;
    let dims = carouselDimsFor(window.innerWidth);
    let raf = 0;
    let autoplay: ReturnType<typeof setInterval> | null = null;
    let shownActive = -1;

    const onResize = () => {
      dims = carouselDimsFor(window.innerWidth);
    };

    const getWrapDiff = (index: number, currentFloat: number) => {
      let diff = (index - currentFloat) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return diff;
    };

    const clearAutoplay = () => {
      if (autoplay) {
        clearInterval(autoplay);
        autoplay = null;
      }
    };
    const startAutoplay = () => {
      clearAutoplay();
      autoplay = setInterval(() => {
        state.target += 1;
      }, 3200);
    };
    const resetAutoplay = () => {
      if (!state.hovered) startAutoplay();
    };

    const tick = () => {
      state.current += (state.target - state.current) * 0.09;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const diff = getWrapDiff(i, state.current);
        const absDiff = Math.abs(diff);
        const tx = diff * dims.spacingX;
        const ty = Math.pow(absDiff, 1.6) * dims.curveY;
        const tz = -absDiff * dims.depthZ;
        const ry = -diff * dims.rotateAmt;
        const scale = Math.max(0.62, 1 - absDiff * 0.14);
        const opacity = Math.max(0, 1 - absDiff * 0.3);
        const blur = absDiff > 1.3 ? (absDiff - 1.3) * 3 : 0;
        el.style.transform = `translate(-50%, -50%) translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${ry}deg) scale(${scale})`;
        el.style.zIndex = String(Math.round(100 - absDiff * 10));
        el.style.opacity = String(opacity);
        el.style.filter = blur ? `blur(${blur}px)` : "";
      });

      let active = Math.round(state.target) % total;
      if (active < 0) active += total;
      if (active !== shownActive) {
        shownActive = active;
        dotRefs.current.forEach((dot, i) => {
          if (!dot) return;
          dot.classList.toggle("bg-brand-600", i === active);
          dot.classList.toggle("w-6", i === active);
          dot.classList.toggle("bg-navy-300", i !== active);
          dot.classList.toggle("dark:bg-navy-600", i !== active);
        });
      }

      raf = requestAnimationFrame(tick);
    };

    const onPointerDown = (e: PointerEvent) => {
      state.dragging = true;
      state.moved = false;
      state.startX = e.clientX;
      state.dragStartTarget = state.target;
      clearAutoplay();
      wrapper.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      const deltaX = e.clientX - state.startX;
      if (Math.abs(deltaX) > 5) state.moved = true;
      const sensitivity = Math.max(window.innerWidth / 3.5, 160);
      state.target = state.dragStartTarget - deltaX / sensitivity;
    };
    const onPointerUp = () => {
      if (!state.dragging) return;
      state.dragging = false;
      state.target = Math.round(state.target);
      wrapper.style.cursor = "grab";
      resetAutoplay();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      state.target += Math.sign(e.deltaY);
      clearAutoplay();
      resetAutoplay();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        state.target -= 1;
        clearAutoplay();
        resetAutoplay();
      } else if (e.key === "ArrowRight") {
        state.target += 1;
        clearAutoplay();
        resetAutoplay();
      }
    };
    const onMouseEnter = () => {
      state.hovered = true;
      clearAutoplay();
    };
    const onMouseLeave = () => {
      state.hovered = false;
      startAutoplay();
    };
    const onPrevClick = () => {
      state.target -= 1;
      clearAutoplay();
      resetAutoplay();
    };
    const onNextClick = () => {
      state.target += 1;
      clearAutoplay();
      resetAutoplay();
    };
    const dotClickHandlers = dotRefs.current.map((_, i) => () => {
      state.target = Math.round(state.target / total) * total + i;
      clearAutoplay();
      resetAutoplay();
    });

    window.addEventListener("resize", onResize);
    wrapper.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    wrapper.addEventListener("wheel", onWheel, { passive: false });
    wrapper.addEventListener("keydown", onKeyDown);
    wrapper.addEventListener("mouseenter", onMouseEnter);
    wrapper.addEventListener("mouseleave", onMouseLeave);
    prevBtnRef.current?.addEventListener("click", onPrevClick);
    nextBtnRef.current?.addEventListener("click", onNextClick);
    dotRefs.current.forEach((dot, i) => dot?.addEventListener("click", dotClickHandlers[i]));

    raf = requestAnimationFrame(tick);
    startAutoplay();

    return () => {
      window.removeEventListener("resize", onResize);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      wrapper.removeEventListener("wheel", onWheel);
      wrapper.removeEventListener("keydown", onKeyDown);
      wrapper.removeEventListener("mouseenter", onMouseEnter);
      wrapper.removeEventListener("mouseleave", onMouseLeave);
      prevBtnRef.current?.removeEventListener("click", onPrevClick);
      nextBtnRef.current?.removeEventListener("click", onNextClick);
      dotRefs.current.forEach((dot, i) => dot?.removeEventListener("click", dotClickHandlers[i]));
      cancelAnimationFrame(raf);
      clearAutoplay();
    };
  }, [total]);

  return (
    <div>
      <div
        ref={wrapperRef}
        tabIndex={0}
        aria-label="Photo gallery carousel"
        className="relative h-72 cursor-grab touch-pan-y outline-none perspective-[1800px] sm:h-80 lg:h-96"
      >
        <div className="absolute inset-0 transform-3d">
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() => {
                if (stateRef.current.moved) return;
                setLightboxIndex(i);
              }}
              className="absolute top-1/2 left-1/2 h-56 w-36 cursor-zoom-in overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 will-change-transform sm:h-72 sm:w-44 lg:h-80 lg:w-52"
            >
              <img
                src={galleryThumb(item)}
                alt={t(item.caption)}
                loading="lazy"
                draggable={false}
                onError={() => setBrokenIds((prev) => new Set(prev).add(item.id))}
                className="pointer-events-none h-full w-full object-cover"
              />
              {item.type === "video" && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/40 backdrop-blur-sm">
                    <FaPlay size={16} className="ml-0.5" />
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          ref={prevBtnRef}
          type="button"
          aria-label="Previous"
          className="absolute top-1/2 left-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-navy-200 bg-white/90 text-navy-700 backdrop-blur transition-transform hover:scale-105 sm:left-4 dark:border-navy-700 dark:bg-navy-800/90 dark:text-navy-200"
        >
          <FaChevronLeft size={14} />
        </button>
        <button
          ref={nextBtnRef}
          type="button"
          aria-label="Next"
          className="absolute top-1/2 right-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-navy-200 bg-white/90 text-navy-700 backdrop-blur transition-transform hover:scale-105 sm:right-4 dark:border-navy-700 dark:bg-navy-800/90 dark:text-navy-200"
        >
          <FaChevronRight size={14} />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === 0 ? "w-6 bg-brand-600" : "w-2 bg-navy-300 dark:bg-navy-600"}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <LuX size={20} />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i === null ? null : (i - 1 + total) % total));
                  }}
                  aria-label="Previous"
                  className="absolute top-1/2 left-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i === null ? null : (i + 1) % total));
                  }}
                  aria-label="Next"
                  className="absolute top-1/2 right-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
                >
                  <FaChevronRight size={16} />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full max-w-full flex-col items-center gap-3"
            >
              {active.type === "video" ? (
                activeYouTubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeYouTubeId}?autoplay=1`}
                    title={t(active.caption)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video max-h-[80vh] w-[92vw] max-w-4xl rounded-lg border-0 bg-black"
                  />
                ) : (
                  <video
                    src={active.src}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
                  />
                )
              ) : (
                <img
                  src={active.src}
                  alt={t(active.caption)}
                  className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
                />
              )}
              <p className="text-center text-sm text-navy-200">{t(active.caption)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Home() {
  const t = useT();
  const [dynamicGallery, setDynamicGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetchGalleryItems()
      .then((items) => {
        if (items && items.length > 0) {
          const mapped: GalleryItem[] = items
            .filter((item) => typeof item.imageUrl === "string" && item.imageUrl.trim() !== "")
            .map((item, idx) => ({
            id: typeof item._id === "string" ? Number(item._id.replace(/\D/g, "").slice(-6)) || (1000 + idx) : 1000 + idx,
            type: item.type || "photo",
            src: item.imageUrl,
            caption: {
              en: item.caption?.en || item.title,
              hi: item.caption?.hi || item.caption?.en || item.title,
              te: item.caption?.te || item.caption?.en || item.title,
              gu: item.caption?.gu || item.caption?.en || item.title,
              ur: item.caption?.ur || item.caption?.en || item.title,
              sd: item.caption?.sd || item.caption?.en || item.title,
            },
          }));
          setDynamicGallery(mapped);
        }
      })
      .catch((err) => console.warn("Live gallery fetch error:", err));
  }, []);

  const carouselItems = [...dynamicGallery, ...staticGalleryItems]
    .filter((item) => galleryThumb(item) !== "")
    .slice(0, 16);

  return (
    <div>
      <VideoHero />

      {/* Hero */}
      <section className="relative overflow-hidden ">
        <RadarSweepPattern />
        <motion.div
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <MotionSection>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
                {t(ui.home.heroKicker)}
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight dark:text-white text-black sm:text-5xl lg:text-6xl">
                {t(ui.home.heroTitle)}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-black dark:text-navy-200">{t(ui.home.heroBody)}</p>
              <div className="mt-10">
                <EmergencyButton size="lg" />
              </div>
              <div className="mt-6">
                <p className="text-xs font-medium tracking-wide text-navy-500 uppercase dark:text-navy-400">
                  {t(ui.home.channelsStripTitle)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHANNEL_STRIP.map(({ icon: Icon, label, href }) => {
                    const className =
                      "flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-600 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-300 dark:hover:text-brand-400";
                    return href ? (
                      <a key={label} href={href} className={className}>
                        <Icon size={13} />
                        {label}
                      </a>
                    ) : (
                      <Link key={label} to="/reach-us" className={className}>
                        <Icon size={13} />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </MotionSection>

            {/* Impact stats */}
            <section>
              <StaggerGroup className="grid grid-cols-2 gap-4" staggerDelay={0.12}>
                {impactStats.map((stat, i) => {
                  const Icon = impactIcons[i];
                  return (
                    <motion.div
                      key={t(stat.label)}
                      variants={flipItem}
                      style={{ transformPerspective: 800 }}
                    >
                      <StatCard value={stat.value} label={t(stat.label)} icon={<Icon size={22} />} />
                    </motion.div>
                  );
                })}
              </StaggerGroup>
            </section>
          </div>
        </div>
      </section>

      {/* When to call strip */}
      <MotionSection className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-navy-100 bg-navy-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-navy-700 dark:bg-navy-900/40">
          <div>
            <p className="font-display font-semibold text-navy-900 dark:text-navy-50">{t(ui.home.whenToCallStripTitle)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {situations.slice(0, 4).map((s) => (
                <Link
                  key={s.title.en}
                  to="/when-to-call"
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-navy-600 shadow-sm transition-colors hover:bg-brand-600 hover:text-white dark:bg-navy-800 dark:text-navy-300 dark:hover:bg-brand-600 dark:hover:text-white"
                >
                  {t(s.title)}
                </Link>
              ))}
            </div>
          </div>
          <Link
            to="/when-to-call"
            className="flex flex-none items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {t(ui.home.whenToCallStripCta)} <FaArrowRight size={12} />
          </Link>
        </div>
      </MotionSection>

      {/* Leadership */}
      <section className=" pt-2 pb-20 dark:bg-navy-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="mx-auto max-w-2xl text-center">
            <img src={policeLogo} alt="Telangana Police" className="mx-auto h-16 w-auto" />
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900 dark:text-navy-50 sm:text-4xl">{t(ui.home.leadershipTitle)}</h2>
            <p className="mt-3 text-navy-500 dark:text-navy-400">{t(ui.home.leadershipBody)}</p>
          </MotionSection>
          <StaggerGroup className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((leader) => (
              <LeaderCard key={leader.name} leader={leader} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Fleet & Infrastructure */}
      <section className="relative overflow-hidden dark:bg-navy-900 pt-2 pb-20">
        <SignalWavesPattern />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="w-full flex  flex-col  items-center ">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-accent-400">{t(ui.home.fleetKicker)}</p>
            <h2 className="mt-2 font-display text-3xl font-bold dark:text-white sm:text-4xl">{t(ui.home.fleetTitle)}</h2>
            <p className="mt-3 text-navy-300">{t(ui.home.fleetBody)}</p>
          </MotionSection>
          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fleetStats.map((f, i) => {
              const Icon = fleetIcons[i];
              return (
                <motion.div
                  key={t(f.label)}
                  variants={staggerItem}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative overflow-hidden rounded-2xl border border-transparent bg-navy-900 p-6 shadow-none transition-[box-shadow,border-color] duration-300 hover:border-accent-500/40 hover:shadow-lg hover:shadow-accent-500/10"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-500/0 blur-2xl transition-colors duration-500 group-hover:bg-accent-500/20" />
                  <Icon
                    size={22}
                    className="relative text-accent-400 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-accent-300"
                  />
                  <p className="relative mt-4 font-mono text-3xl font-bold text-white">{f.value}</p>
                  <p className="relative mt-1 font-medium text-navy-200">{t(f.label)}</p>
                  <p className="relative mt-2 text-sm text-navy-400">{t(f.description)}</p>
                </motion.div>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* Decade of Service */}
      <section className="bg-navy-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="mx-auto max-w-2xl text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-accent-400">{t(ui.home.decadeKicker)}</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{t(ui.home.decadeTitle)}</h2>
            <p className="mt-3 text-navy-300">{t(ui.home.decadeBody)}</p>
          </MotionSection>
          <StaggerGroup className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {decadeStats.slice(0, 2).map((stat) => (
                <motion.div key={t(stat.label)} variants={staggerItem}>
                  <DecadeStatBlock stat={stat} />
                </motion.div>
              ))}
            </div>
            <motion.div variants={staggerItem} className="order-first lg:order-0">
              <ShortsVideoCard />
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {decadeStats.slice(2, 4).map((stat) => (
                <motion.div key={t(stat.label)} variants={staggerItem}>
                  <DecadeStatBlock stat={stat} />
                </motion.div>
              ))}
            </div>
          </StaggerGroup>
        </div>
      </section>

      {/* Daily Statistics */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
              {t(ui.home.dailyKicker)}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 dark:text-navy-50 sm:text-4xl">{t(ui.home.dailyTitle)}</h2>
            <p className="mt-3 text-navy-500 dark:text-navy-400">{t(ui.home.dailyBody)}</p>
          </MotionSection>
          <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dailyStats.map((stat) => (
              <motion.div key={t(stat.label)} variants={staggerItem}>
                <DailyStatRow stat={stat} />
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="overflow-hidden bg-navy-50 py-20 dark:bg-navy-900/40">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection className="mx-auto max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
              {t(ui.home.galleryKicker)}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 dark:text-navy-50 sm:text-4xl">{t(ui.home.galleryTitle)}</h2>
          </MotionSection>

          <div className="mt-12">
            <GalleryCarousel items={carouselItems} />
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <p className="text-navy-500 dark:text-navy-400">{t(ui.home.galleryBody)}</p>
            <Link
              to="/gallery"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400"
            >
              {t(ui.common.viewAll)} <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>


      {/* Stay Connected */}
      <MotionSection className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-navy-900 dark:text-navy-50 sm:text-4xl">{t(ui.home.stayConnectedTitle)}</h2>
        <p className="mt-3 text-navy-500 dark:text-navy-400">{t(ui.home.followUs)}</p>
        <StaggerGroup className="mt-10 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks
            .filter((s): s is typeof s & { icon: keyof typeof socialIconMap } => s.icon in socialIconMap)
            .map((social) => (
              <SocialPreviewCard key={social.label} social={social} />
            ))}
        </StaggerGroup>
      </MotionSection>
    </div>
  );
}