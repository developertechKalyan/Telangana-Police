import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaXmark, FaPlay, FaCamera, FaShieldHalved, FaTrashCan } from "react-icons/fa6";
import { LuSparkles, LuLoaderCircle } from "react-icons/lu";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { galleryItems as staticGalleryItems } from "@/data/gallery";
import { fetchGalleryItems, deleteGalleryItemApi, type ApiGalleryItem } from "@/lib/api";
import { useT } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import type { LocalizedText } from "@/i18n/locales";
import galleryHero from "@/assets/gallery/gallery3.jpeg";

type Tab = "All Media" | "Recent Uploads" | "Photos" | "Videos";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

const TAB_LABELS: Record<Tab, LocalizedText> = {
  "All Media": { en: "All Media", hi: "सभी मीडिया", te: "అన్ని మీడియా", gu: "બધું મીડિયા", ur: "تمام میڈیا", sd: "سمورو ميڊيا" },
  "Recent Uploads": { en: "Recent Uploads", hi: "हालिया अपलोड", te: "ఇటీవలి అప్‌లోడ్‌లు", gu: "તાજેતરના અપલોડ", ur: "حالیہ اپ لوڈز", sd: "تازو اپلوڊ" },
  Photos: { en: "Photos", hi: "तस्वीरें", te: "ఫోటోలు", gu: "ફોટા", ur: "تصاویر", sd: "تصويرون" },
  Videos: { en: "Videos", hi: "वीडियो", te: "వీడియోలు", gu: "વિડિયો", ur: "ویڈیوز", sd: "وڊيوز" },
};

const HERO_KICKER: LocalizedText = {
  en: "Official Feed",
  hi: "दृश्य पुरालेख और आधिकारिक फ़ीड",
  te: "దృశ్య ఆర్కైవ్ మరియు అధికారిక ఫీడ్",
  gu: "વિઝ્યુઅલ આર્કાઇવ અને સત્તાવાર ફીડ",
  ur: "بصری آرکائیو اور سرکاری فیڈ",
  sd: "بصري آرڪائيو ۽ سرڪاري فيڊ",
};

const HERO_TITLE_PREFIX: LocalizedText = { en: "Photo &", hi: "फोटो और", te: "ఫోటో మరియు", gu: "ફોટો અને", ur: "تصویر اور", sd: "تصوير ۽" };
const HERO_TITLE_HIGHLIGHT: LocalizedText = { en: "Video", hi: "वीडियो", te: "వీడియో", gu: "વિડિયો", ur: "ویڈیو", sd: "وڊيو" };
const HERO_TITLE_SUFFIX: LocalizedText = { en: "Gallery", hi: "गैलरी", te: "గ్యాలరీ", gu: "ગેલેરી", ur: "گیلری", sd: "گيلري" };

const HERO_SUBTITLE: LocalizedText = {
  en: "Documenting the dedication, reach, and impact of Telangana Police Dial 112 — from rescue missions to community outreach across all units.",
  hi: "तेलंगाना पुलिस डायल 112 के समर्पण, पहुंच और प्रभाव का दस्तावेजीकरण — बचाव अभियानों से लेकर सभी इकाइयों में सामुदायिक पहुंच तक।",
  te: "తెలంగాణ పోలీస్ డయల్ 112 అంకితభావం, విస్తరణ మరియు ప్రభావాన్ని రికార్డు చేస్తూ — రక్షణ కార్యకలాపాల నుండి అన్ని యూనిట్లలో సామాజిక అనుసంధానం వరకు.",
  gu: "તેલંગાણા પોલીસ ડાયલ 112 ના સમર્પણ, પહોંચ અને અસરનું દસ્તાવેજીકરણ — બચાવ મિશનથી લઈને તમામ યુનિટમાં સામુદાયિક પહોંચ સુધી.",
  ur: "تلنگانہ پولیس ڈائل 112 کی لگن، رسائی اور اثر کی دستاویز کاری — امدادی مشنز سے لے کر تمام یونٹس میں کمیونٹی رسائی تک۔",
  sd: "تلنگانا پوليس ڊائل 112 جي وقف، رسائي ۽ اثر جي دستاويز سازي — بچاءُ مشنن کان وٺي سمورن يونٽن ۾ ڪميونٽي رسائي تائين.",
};

const STAT_DISTRICTS: LocalizedText = { en: "Units", hi: "इकाइयां", te: "యూనిట్లు", gu: "યુનિટ", ur: "یونٹس", sd: "يونٽ" };
const STAT_AVAILABILITY: LocalizedText = { en: "Availability", hi: "उपलब्धता", te: "లభ్యత", gu: "ઉપલબ્ધતા", ur: "دستیابی", sd: "دستيابي" };
const STAT_PEOPLE_SERVED: LocalizedText = {
  en: "People Served",
  hi: "सेवा प्राप्त लोग",
  te: "సేవ పొందిన ప్రజలు",
  gu: "સેવા આપેલા લોકો",
  ur: "خدمت یافتہ افراد",
  sd: "خدمت حاصل ڪندڙ ماڻهو",
};

const CLOSE_LABEL: LocalizedText = { en: "Close", hi: "बंद करें", te: "మూసివేయి", gu: "બંધ કરો", ur: "بند کریں", sd: "بند ڪريو" };

interface DisplayItem {
  id: string | number;
  type: "photo" | "video";
  caption: LocalizedText;
  src: string;
  isDynamic?: boolean;
  category?: string;
}

export function Gallery() {
  const t = useT();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("All Media");
  const [active, setActive] = useState<string | number | null>(null);
  const [dynamicItems, setDynamicItems] = useState<ApiGalleryItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch dynamic items from backend
  const loadDynamicItems = () => {
    fetchGalleryItems()
      .then((data) => setDynamicItems(data))
      .catch((err) => console.warn("Failed to load live gallery items:", err));
  };

  useEffect(() => {
    loadDynamicItems();
  }, []);

  // Delete dynamic gallery item directly
  const handleDeleteDynamic = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this official gallery image permanently?")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteGalleryItemApi(id);
      setDynamicItems((prev) => prev.filter((item) => item._id !== id));
      if (active === id) {
        setActive(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  // Merge dynamic items with static items
  const allMergedItems: DisplayItem[] = useMemo(() => {
    const dynamicMapped: DisplayItem[] = dynamicItems.map((item) => ({
      id: item._id,
      type: "photo",
      src: item.imageUrl,
      caption: {
        en: item.caption?.en || item.title,
        hi: item.caption?.hi || item.caption?.en || item.title,
        te: item.caption?.te || item.caption?.en || item.title,
        gu: item.caption?.gu || item.caption?.en || item.title,
        ur: item.caption?.ur || item.caption?.en || item.title,
        sd: item.caption?.sd || item.caption?.en || item.title,
      },
      isDynamic: true,
      category: item.category,
    }));

    const staticMapped: DisplayItem[] = staticGalleryItems.map((item) => ({
      id: item.id,
      type: item.type,
      caption: item.caption,
      src: item.src,
      isDynamic: false,
    }));

    // Put newest dynamic uploads first
    return [...dynamicMapped, ...staticMapped];
  }, [dynamicItems]);

  const photoCount = allMergedItems.filter((i) => i.type === "photo").length;
  const videoCount = allMergedItems.filter((i) => i.type === "video").length;
  const recentCount = dynamicItems.length;

  const filtered = useMemo(() => {
    if (tab === "Recent Uploads") return allMergedItems.filter((i) => i.isDynamic);
    if (tab === "Photos") return allMergedItems.filter((i) => i.type === "photo");
    if (tab === "Videos") return allMergedItems.filter((i) => i.type === "video");
    return allMergedItems;
  }, [tab, allMergedItems]);

  const activeItem = allMergedItems.find((i) => i.id === active) ?? null;
  const activeYoutubeId = activeItem?.type === "video" ? getYouTubeId(activeItem.src) : null;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-30">
        <img src={galleryHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/75 to-navy-950/55" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection>
            <span className="inline-flex items-center gap-2 text-white rounded-full border border-accent-400/40 bg-navy-950/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-300 uppercase backdrop-blur">
              <FaCamera size={12} /> {t(HERO_KICKER)}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">
              {t(HERO_TITLE_PREFIX)} <span className="text-accent-400">{t(HERO_TITLE_HIGHLIGHT)}</span> {t(HERO_TITLE_SUFFIX)}
            </h1>
            <p className="mt-4 text-navy-200">{t(HERO_SUBTITLE)}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <EmergencyButton size="md" />
            </div>
          </MotionSection>
        </div>
        <div className="absolute inset-x-0 -bottom-1 h-10 rounded-t-[2.5rem] bg-white sm:h-14 dark:bg-navy-950" />
      </section>

      {/* Gallery Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {([
              ["All Media", allMergedItems.length],
              ["Recent Uploads", recentCount],
              ["Photos", photoCount],
              ["Videos", videoCount],
            ] as [Tab, number][]).map(([label, count]) => (
              <button
                key={label}
                onClick={() => setTab(label)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === label
                    ? "bg-brand-600 text-white"
                    : "bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-300"
                }`}
              >
                {t(TAB_LABELS[label])} · {count}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {recentCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-600 dark:text-accent-400">
                <LuSparkles size={14} />
                <span>{recentCount} Live Cloudinary Uploads</span>
              </div>
            )}
            {isAuthenticated && (
              <Link
                to="/admin/gallery"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500/20 border border-accent-500/40 px-3 py-1.5 text-xs font-bold text-accent-300 hover:bg-accent-500 hover:text-navy-950 transition-colors"
              >
                <FaShieldHalved size={12} /> Post More Images
              </Link>
            )}
          </div>
        </div>

        <StaggerGroup key={tab} className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            const youtubeId = item.type === "video" ? getYouTubeId(item.src) : null;
            return (
              <motion.div
                key={item.id}
                variants={staggerItem}
                className="group relative block aspect-square overflow-hidden rounded-xl bg-navy-900 text-left"
              >
                <button
                  type="button"
                  onClick={() => setActive(item.id)}
                  aria-label={t(item.caption)}
                  className="h-full w-full block cursor-pointer"
                >
                  {item.type === "video" ? (
                    youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                        alt={t(item.caption)}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                    ) : (
                      <video
                        src={item.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                    )
                  ) : (
                    <img
                      src={item.src}
                      alt={t(item.caption)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                    />
                  )}

                  {/* Dynamic Cloudinary Live Badge */}
                  {item.isDynamic && (
                    <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-navy-950/80 px-2 py-0.5 text-[9px] font-bold text-accent-300 backdrop-blur">
                      <FaShieldHalved size={9} /> {item.category || "Official"}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/0 to-navy-950/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {item.type === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-950/60 text-white backdrop-blur transition-transform duration-300 group-hover:scale-110">
                        <FaPlay size={14} />
                      </span>
                    </span>
                  )}
                  
                  <p className="absolute inset-x-0 bottom-0 line-clamp-2 translate-y-2 p-3 text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {t(item.caption)}
                  </p>
                </button>

                {/* Quick Delete icon for logged-in officers */}
                {isAuthenticated && item.isDynamic && typeof item.id === "string" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDynamic(item.id as string);
                    }}
                    title="Delete Image (Officer)"
                    className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/90 text-white opacity-0 shadow-md backdrop-blur transition-all group-hover:opacity-100 hover:scale-110 hover:bg-red-500"
                  >
                    <FaTrashCan size={11} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </StaggerGroup>

        {/* Bottom Metrics */}
        <div className="mt-16 grid grid-cols-3 gap-6 rounded-2xl bg-navy-50 p-8 text-center dark:bg-navy-900/40">
          <div>
            <p className="font-mono text-2xl font-bold text-navy-900 dark:text-navy-50">31</p>
            <p className="text-xs text-navy-500 dark:text-navy-400">{t(STAT_DISTRICTS)}</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-navy-900 dark:text-navy-50">24/7</p>
            <p className="text-xs text-navy-500 dark:text-navy-400">{t(STAT_AVAILABILITY)}</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-navy-900 dark:text-navy-50">75M+</p>
            <p className="text-xs text-navy-500 dark:text-navy-400">{t(STAT_PEOPLE_SERVED)}</p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/90 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl overflow-hidden rounded-2xl bg-navy-900 shadow-2xl border border-navy-700"
            >
              {activeItem.type === "video" ? (
                activeYoutubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1`}
                    title={t(activeItem.caption)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full border-0 bg-black"
                  />
                ) : (
                  <video src={activeItem.src} controls autoPlay className="aspect-video w-full bg-black" />
                )
              ) : (
                <img
                  src={activeItem.src}
                  alt={t(activeItem.caption)}
                  className="max-h-[75vh] w-full object-contain bg-navy-950"
                />
              )}
              <div className="flex items-center justify-between p-5 border-t border-navy-800">
                <div>
                  <p className="text-sm font-semibold text-white">{t(activeItem.caption)}</p>
                  {activeItem.isDynamic && activeItem.category && (
                    <span className="mt-1 inline-block text-[11px] text-accent-400">
                      Category: {activeItem.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {isAuthenticated && activeItem.isDynamic && typeof activeItem.id === "string" && (
                    <button
                      onClick={() => handleDeleteDynamic(activeItem.id as string)}
                      disabled={deletingId === activeItem.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/20 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-600 hover:text-white transition-colors"
                    >
                      {deletingId === activeItem.id ? (
                        <LuLoaderCircle size={13} className="animate-spin" />
                      ) : (
                        <FaTrashCan size={13} />
                      )}
                      <span>Delete Post</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActive(null)}
                    aria-label={t(CLOSE_LABEL)}
                    className="text-navy-300 hover:text-white p-2 rounded-lg bg-navy-800 hover:bg-navy-700 transition-colors"
                  >
                    <FaXmark size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
