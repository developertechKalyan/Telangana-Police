import { useState } from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FaPhone, FaCommentSms, FaMobileScreenButton, FaWhatsapp, FaRobot, FaEnvelope, FaBusSimple, FaHeadset } from "react-icons/fa6";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { channels } from "@/data/channels";
import { useT } from "@/contexts/LanguageContext";
import type { LocalizedText } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import reachUsHero from "@/assets/gallery/gallery5.jpeg";

const CHANNEL_ICONS: IconType[] = [FaPhone, FaCommentSms, FaMobileScreenButton, FaWhatsapp, FaRobot, FaEnvelope, FaBusSimple];

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

const HERO_TITLE = lt("How to Reach Us", "हम तक कैसे पहुंचें", "మమ్మల్ని ఎలా సంప్రదించాలి", "અમારો સંપર્ક કેવી રીતે કરવો", "ہم تک کیسے پہنچیں", "اسان تائين ڪيئن پھچجي");

const HERO_SUBTITLE = lt(
  "Seven ways to reach Dial 112 — choose whichever works for your situation. In a life-threatening emergency, calling is always fastest.",
  "डायल 112 तक पहुंचने के सात तरीके — जो भी आपकी स्थिति के लिए उपयुक्त हो उसे चुनें। जानलेवा आपात स्थिति में, कॉल करना हमेशा सबसे तेज़ होता है।",
  "డయల్ 112ను సంప్రదించడానికి ఏడు మార్గాలు — మీ పరిస్థితికి సరిపోయేది ఎంచుకోండి. ప్రాణాంతక అత్యవసర పరిస్థితుల్లో, కాల్ చేయడం ఎల్లప్పుడూ వేగవంతమైనది.",
  "ડાયલ 112 સુધી પહોંચવાની સાત રીતો — તમારી પરિસ્થિતિ માટે જે યોગ્ય હોય તે પસંદ કરો. જીવલેણ કટોકટીમાં, કૉલ કરવો હંમેશા સૌથી ઝડપી હોય છે.",
  "ڈائل 112 تک پہنچنے کے سات طریقے — جو بھی آپ کی صورتحال کے لیے موزوں ہو اسے منتخب کریں۔ جان لیوا ایمرجنسی میں، کال کرنا ہمیشہ تیز ترین ہوتا ہے۔",
  "ڊائل 112 تائين پھچڻ جا ست طريقا — جيڪو به توهان جي حالت لاءِ مناسب هجي اهو چونڊيو. جان جي خطري واري ايمرجنسي ۾، ڪال ڪرڻ هميشه تڪڙو هوندو آهي.",
);

const SELECTOR_KICKER = lt(
  "Choose your situation",
  "अपनी स्थिति चुनें",
  "మీ పరిస్థితిని ఎంచుకోండి",
  "તમારી પરિસ્થિતિ પસંદ કરો",
  "اپنی صورتحال منتخب کریں",
  "پنهنجي حالت چونڊيو",
);

type FilterTag = "cant-speak" | "send-photos" | "no-internet";

const FILTERS: { tag: FilterTag; label: LocalizedText }[] = [
  {
    tag: "cant-speak",
    label: lt("I can't speak aloud", "मैं जोर से बोल नहीं सकता", "నేను బిగ్గరగా మాట్లాడలేను", "હું મોટેથી બોલી શકતો નથી", "میں زور سے بول نہیں سکتا", "مان مٿانهون ڳالهائي نه ٿو سگهان"),
  },
  {
    tag: "send-photos",
    label: lt(
      "I want to send photos",
      "मैं फोटो भेजना चाहता हूं",
      "నేను ఫోటోలు పంపాలనుకుంటున్నాను",
      "હું ફોટા મોકલવા માંગુ છું",
      "میں تصاویر بھیجنا چاہتا ہوں",
      "مان فوٽو موڪلڻ چاهيان ٿو",
    ),
  },
  {
    tag: "no-internet",
    label: lt("I don't have internet", "मेरे पास इंटरनेट नहीं है", "నాకు ఇంటర్నెట్ లేదు", "મારી પાસે ઇન્ટરનેટ નથી", "میرے پاس انٹرنیٹ نہیں ہے", "مون وٽ انٽرنيٽ ناهي"),
  },
];

const RESET_LABEL = lt("Show all channels", "सभी माध्यम दिखाएं", "అన్ని ఛానెల్‌లను చూపించు", "બધા ચેનલો બતાવો", "تمام ذرائع دکھائیں", "سمورا ذريعا ڏيکاريو");

const RECOMMENDED_LABEL = lt(
  "Recommended for you",
  "आपके लिए अनुशंसित",
  "మీ కోసం సిఫార్సు చేయబడినవి",
  "તમારા માટે ભલામણ કરેલ",
  "آپ کے لیے تجویز کردہ",
  "توهان لاءِ تجويز ڪيل",
);

const BEST_FOR_LABEL = lt("Best for", "इसके लिए सर्वोत्तम", "దీనికి ఉత్తమమైనది", "આ માટે શ્રેષ્ઠ", "اس کے لیے بہترین", "هن لاءِ بهترين");

const CTA_TITLE = lt("Not sure which channel to use?", "पक्का नहीं कि किस माध्यम का उपयोग करें?", "ఏ ఛానెల్ ఉపయోగించాలో తెలియదా?", "કયું ચેનલ વાપરવું તે ખાતરી નથી?", "یقین نہیں کہ کون سا ذریعہ استعمال کریں؟", "پڪ ناهي ته ڪهڙو ذريعو استعمال ڪجي؟");

const CTA_BODY = lt(
  "If you are unsure or the situation is life-threatening, calling 112 is always the right first step.",
  "अगर आप अनिश्चित हैं या स्थिति जानलेवा है, तो 112 पर कॉल करना हमेशा सही पहला कदम है।",
  "మీకు అనుమానం ఉంటే లేదా పరిస్థితి ప్రాణాంతకమైతే, 112కు కాల్ చేయడం ఎల్లప్పుడూ సరైన మొదటి అడుగు.",
  "જો તમને ખાતરી ન હોય અથવા પરિસ્થિતિ જીવલેણ હોય, તો 112 પર કૉલ કરવો હંમેશા યોગ્ય પ્રથમ પગલું છે.",
  "اگر آپ کو یقین نہیں ہے یا صورتحال جان لیوا ہے، تو 112 پر کال کرنا ہمیشہ درست پہلا قدم ہے۔",
  "جيڪڏهن توهان کي پڪ ناهي يا حالت جان جي خطري واري آهي، ته 112 تي ڪال ڪرڻ هميشه صحيح پهريون قدم آهي.",
);

export function ReachUs() {
  const t = useT();
  const [activeTag, setActiveTag] = useState<FilterTag | null>(null);

  const matchedChannels = activeTag ? channels.filter((c) => c.situationTags.includes(activeTag)) : channels;

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <img src={reachUsHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/80 to-navy-950/60" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection>
            <span className="inline-flex items-center gap-2 text-accent-400 dark:text-white rounded-full border border-accent-400/40 bg-navy-950/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-300 uppercase backdrop-blur">
              <FaHeadset size={12} /> {t(ui.nav.getHelp)}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">{t(HERO_TITLE)}</h1>
            <p className="mt-4 text-lg text-navy-300">{t(HERO_SUBTITLE)}</p>
          </MotionSection>
        </div>
        <div className="absolute inset-x-0 -bottom-1 h-10 rounded-t-[2.5rem] bg-white sm:h-14 dark:bg-navy-950" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <MotionSection className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            {t(SELECTOR_KICKER)}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.tag}
                onClick={() => setActiveTag(activeTag === f.tag ? null : f.tag)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTag === f.tag
                    ? "bg-brand-600 text-white"
                    : "bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-300 dark:hover:bg-navy-700"
                }`}
              >
                {t(f.label)}
              </button>
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="rounded-full px-4 py-2 text-sm font-medium text-navy-500 underline decoration-dotted hover:text-navy-800 dark:text-navy-400 dark:hover:text-navy-100"
              >
                {t(RESET_LABEL)}
              </button>
            )}
          </div>
        </MotionSection>

        {activeTag && (
          <MotionSection className="mx-auto mt-6 max-w-2xl rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 text-center dark:border-brand-800 dark:bg-brand-900/20">
            <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
              {t(RECOMMENDED_LABEL)}: {matchedChannels.map((c) => t(c.title)).join(", ")}
            </p>
          </MotionSection>
        )}

        <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matchedChannels.map((channel) => {
            const Icon = CHANNEL_ICONS[channels.indexOf(channel)];
            return (
              <motion.div
                key={channel.title.en}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-400 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon size={19} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy-900 dark:text-navy-50">{t(channel.title)}</h3>
                <p className="mt-1.5 text-sm font-medium text-accent-600 dark:text-accent-400">
                  {t(BEST_FOR_LABEL)}: {t(channel.bestFor)}
                </p>
                <ol className="mt-4 space-y-2">
                  {channel.steps.map((step, si) => (
                    <li key={step.en} className="flex items-start gap-2.5 text-sm text-navy-600 dark:text-navy-300">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-50 font-mono text-[11px] font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                        {si + 1}
                      </span>
                      {t(step)}
                    </li>
                  ))}
                </ol>
                {channel.note && (
                  <p className="mt-4 rounded-lg bg-navy-50 px-3 py-2 text-xs text-navy-500 dark:bg-navy-900/40 dark:text-navy-400">
                    {t(channel.note)}
                  </p>
                )}
              </motion.div>
            );
          })}
        </StaggerGroup>
      </section>

      <section className="bg-navy-50 py-16 text-center dark:bg-navy-800/60">
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{t(CTA_TITLE)}</h2>
        <p className="mx-auto mt-2 max-w-xl text-navy-500 dark:text-navy-400">{t(CTA_BODY)}</p>
        <div className="mt-6 flex justify-center">
          <EmergencyButton size="lg" />
        </div>
      </section>
    </div>
  );
}
