import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IconType } from "react-icons";
import { FaMagnifyingGlass, FaCarBurst } from "react-icons/fa6";
import { LuUsers, LuShieldAlert, LuCar, LuSiren, LuClock, LuListChecks, LuMapPin } from "react-icons/lu";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { services, serviceCategories } from "@/data/services";
import type { ServiceCategory } from "@/types/content";
import { useT } from "@/contexts/LanguageContext";
import { useCountUp } from "@/hooks/useCountUp";
import type { LocalizedText } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import servicesHero from "@/assets/gallery/gallery5.jpeg";

const CATEGORY_ACCENT: Record<ServiceCategory, string> = {
  "Community Services": "from-brand-600 to-brand-400",
  "Personal Safety Services": "from-accent-600 to-accent-400",
  "Traffic Services": "from-navy-600 to-navy-400",
  "Emergency Services": "from-emergency-600 to-emergency-400",
};

function HeroStat({ icon: Icon, value, suffix, label }: { icon: IconType; value: number; suffix?: string; label: string }) {
  const { ref, formatted } = useCountUp(value);
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-accent-400">
        <Icon size={16} />
      </span>
      <div className="text-left">
        <p className="font-mono text-2xl font-bold text-white">
          <span ref={ref}>{formatted}</span>
          {suffix}
        </p>
        <p className="text-xs text-navy-400">{label}</p>
      </div>
    </div>
  );
}

const CATEGORY_LABELS: Record<ServiceCategory, LocalizedText> = {
  "Community Services": {
    en: "Community Services",
    hi: "सामुदायिक सेवाएं",
    te: "సామాజిక సేవలు",
    gu: "સામુદાયિક સેવાઓ",
    ur: "کمیونٹی خدمات",
    sd: "ڪميونٽي خدمتون",
  },
  "Personal Safety Services": {
    en: "Personal Safety Services",
    hi: "व्यक्तिगत सुरक्षा सेवाएं",
    te: "వ్యక్తిగత భద్రతా సేవలు",
    gu: "વ્યક્તિગત સલામતી સેવાઓ",
    ur: "ذاتی حفاظتی خدمات",
    sd: "ذاتي حفاظتي خدمتون",
  },
  "Traffic Services": {
    en: "Traffic Services",
    hi: "यातायात सेवाएं",
    te: "ట్రాఫిక్ సేవలు",
    gu: "ટ્રાફિક સેવાઓ",
    ur: "ٹریفک خدمات",
    sd: "ٽرئفڪ خدمتون",
  },
  "Emergency Services": {
    en: "Emergency Services",
    hi: "आपातकालीन सेवाएं",
    te: "అత్యవసర సేవలు",
    gu: "કટોકટી સેવાઓ",
    ur: "ایمرجنسی خدمات",
    sd: "ايمرجنسي خدمتون",
  },
};

const CATEGORY_ICONS: Record<ServiceCategory, IconType> = {
  "Community Services": LuUsers,
  "Personal Safety Services": LuShieldAlert,
  "Traffic Services": LuCar,
  "Emergency Services": LuSiren,
};

const HERO_TITLE: LocalizedText = {
  en: "Our Services — Dial 112",
  hi: "हमारी सेवाएं — डायल 112",
  te: "మా సేవలు — డయల్ 112",
  gu: "અમારી સેવાઓ — ડાયલ 112",
  ur: "ہماری خدمات — ڈائل 112",
  sd: "اسان جون خدمتون — ڊائل 112",
};

const HERO_SUBTITLE: LocalizedText = {
  en: "Comprehensive emergency services across Telangana, ensuring rapid response and community safety in all states.",
  hi: "तेलंगाना भर में व्यापक आपातकालीन सेवाएं, सभी राज्यों में तीव्र प्रतिक्रिया और सामुदायिक सुरक्षा सुनिश्चित करना।",
  te: "తెలంగాణ అంతటా సమగ్ర అత్యవసర సేవలు, అన్ని రాష్ట్రాల్లో వేగవంతమైన స్పందన మరియు సామాజిక భద్రతను నిర్ధారిస్తూ.",
  gu: "તેલંગાણામાં વ્યાપક કટોકટી સેવાઓ, તમામ રાજ્યોમાં ઝડપી પ્રતિભાવ અને સામુદાયિક સલામતી સુનિશ્ચિત કરવી.",
  ur: "تلنگانہ بھر میں جامع ایمرجنسی خدمات، تمام ریاستوں میں تیز رفتار ردعمل اور کمیونٹی سیفٹی کو یقینی بنانا۔",
  sd: "تلنگانا ۾ جامع ايمرجنسي خدمتون، سمورين رياستن ۾ تڪڙو ردعمل ۽ ڪميونٽي حفاظت کي يقيني بڻائڻ.",
};

const STAT_RESPONSE_TIME: LocalizedText = {
  en: "Avg. Response Time",
  hi: "औसत प्रतिक्रिया समय",
  te: "సగటు స్పందన సమయం",
  gu: "સરેરાશ પ્રતિભાવ સમય",
  ur: "اوسط ردعمل کا وقت",
  sd: "اوسط ردعمل جو وقت",
};

const STAT_SERVICES_OFFERED: LocalizedText = {
  en: "Services Offered",
  hi: "प्रदान की गई सेवाएं",
  te: "అందించే సేవలు",
  gu: "આપવામાં આવતી સેવાઓ",
  ur: "پیش کردہ خدمات",
  sd: "پيش ڪيل خدمتون",
};

const STAT_DISTRICTS_COVERED: LocalizedText = {
  en: "Units Covered",
  hi: "कवर की गई इकाइयां",
  te: "కవర్ చేసిన యూనిట్లు",
  gu: "આવરી લેવાયેલા યુનિટ",
  ur: "احاطہ کی گئی یونٹس",
  sd: "ڍڪيل يونٽ",
};

const SEARCH_PLACEHOLDER: LocalizedText = {
  en: "Search services...",
  hi: "सेवाएं खोजें...",
  te: "సేవలు వెతకండి...",
  gu: "સેવાઓ શોધો...",
  ur: "خدمات تلاش کریں...",
  sd: "خدمتون ڳوليو...",
};

const EMPTY_STATE: LocalizedText = {
  en: "No services match your search.",
  hi: "आपकी खोज से कोई सेवा मेल नहीं खाती।",
  te: "మీ శోధనకు సరిపోలే సేవలు లేవు.",
  gu: "તમારી શોધ સાથે કોઈ સેવા મેળ ખાતી નથી.",
  ur: "آپ کی تلاش سے کوئی خدمت مماثل نہیں ہے۔",
  sd: "توهان جي ڳولا سان ڪا به خدمت نه ٿي ملي.",
};

const CTA_TITLE: LocalizedText = {
  en: "Need help right now?",
  hi: "अभी मदद चाहिए?",
  te: "ఇప్పుడే సహాయం కావాలా?",
  gu: "અત્યારે મદદની જરૂર છે?",
  ur: "ابھی مدد چاہیے؟",
  sd: "هاڻي مدد گھرجي؟",
};

const CTA_BODY: LocalizedText = {
  en: "Our teams are on standby, 24 × 7, across all states.",
  hi: "हमारी टीमें सभी राज्यों में 24×7 तैयार हैं।",
  te: "మా బృందాలు అన్ని రాష్ట్రాల్లో 24×7 సిద్ధంగా ఉన్నాయి.",
  gu: "અમારી ટીમો તમામ રાજ્યોમાં 24×7 તૈયાર છે.",
  ur: "ہماری ٹیمیں تمام ریاستوں میں 24×7 تیار ہیں۔",
  sd: "اسان جون ٽيمون سمورين رياستن ۾ 24×7 تيار آهن.",
};

export function Services() {
  const t = useT();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = category === "All" || s.category === category;
      const matchesQuery =
        query.trim() === "" || t(s.title).toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category, t]);

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-24">
        <img src={servicesHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/80 to-navy-950/60" />
        <motion.div
          className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection>
        
            <span className="mt-5 inline-flex items-center gap-2 text-accent-400 dark:text-white rounded-full border border-accent-400/40 bg-navy-950/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-300 uppercase backdrop-blur">
              <FaCarBurst size={12} /> {t(ui.nav.services)}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">{t(HERO_TITLE)}</h1>
            <p className="mt-4 text-lg text-navy-300">{t(HERO_SUBTITLE)}</p>
          </MotionSection>
          <MotionSection delay={0.15} className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-6">
            <HeroStat icon={LuClock} value={16} suffix=" min" label={t(STAT_RESPONSE_TIME)} />
            <HeroStat icon={LuListChecks} value={21} label={t(STAT_SERVICES_OFFERED)} />
            <HeroStat icon={LuMapPin} value={31} label={t(STAT_DISTRICTS_COVERED)} />
          </MotionSection>
        </div>
        <div className="absolute inset-x-0 -bottom-1 h-10 rounded-t-[2.5rem] bg-white sm:h-14 dark:bg-navy-950" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(SEARCH_PLACEHOLDER)}
              className="w-full rounded-full border border-navy-200 bg-white py-2.5 pl-10 pr-4 text-sm text-navy-900 outline-none focus:border-brand-500 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("All")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === "All"
                  ? "bg-brand-600 text-white"
                  : "bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-300 dark:hover:bg-navy-700"
              }`}
            >
              {t(ui.common.all)}
            </button>
            {serviceCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === c
                    ? "bg-brand-600 text-white"
                    : "bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-300 dark:hover:bg-navy-700"
                }`}
              >
                {t(CATEGORY_LABELS[c])}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-16 text-center text-navy-400 dark:text-navy-500"
            >
              {t(EMPTY_STATE)}
            </motion.p>
          ) : (
            <StaggerGroup key={category + query} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((service) => {
                const CategoryIcon = CATEGORY_ICONS[service.category];
                return (
                  <motion.div
                    key={t(service.title)}
                    variants={staggerItem}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800"
                  >
                    <div
                      className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-linear-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20 ${CATEGORY_ACCENT[service.category]}`}
                    />
                    <div className="relative flex items-center justify-between gap-2">
                      <span
                        className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-linear-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${CATEGORY_ACCENT[service.category]}`}
                      >
                        <CategoryIcon size={19} />
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                        {t(CATEGORY_LABELS[service.category])}
                      </span>
                    </div>
                    <h3 className="relative mt-4 font-display text-lg font-semibold text-navy-900 dark:text-navy-50">{t(service.title)}</h3>
                    <p className="relative mt-2 text-sm text-navy-500 dark:text-navy-400">{t(service.description)}</p>
                    <p className="relative mt-3 text-sm font-medium text-accent-600 dark:text-accent-400">{t(service.stat)}</p>
                    <ul className="relative mt-4 flex flex-wrap gap-2">
                      {service.features.map((f) => (
                        <li key={t(f)} className="rounded-full bg-navy-50 px-2.5 py-1 text-xs text-navy-600 dark:bg-navy-800/60 dark:text-navy-300">
                          {t(f)}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </StaggerGroup>
          )}
        </AnimatePresence>
      </section>

      <section className="bg-navy-50 py-16 text-center dark:bg-navy-800/60">
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{t(CTA_TITLE)}</h2>
        <p className="mt-2 text-navy-500 dark:text-navy-400">{t(CTA_BODY)}</p>
        <div className="mt-6 flex justify-center">
          <EmergencyButton size="lg" />
        </div>
      </section>
    </div>
  );
}
