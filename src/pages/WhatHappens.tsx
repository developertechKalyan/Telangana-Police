import { motion } from "framer-motion";
import { FaRoute, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { Timeline } from "@/components/ui/Timeline";
import { journeySteps, doDonts } from "@/data/journeySteps";
import { useT } from "@/contexts/LanguageContext";
import type { LocalizedText } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import heroImg from "@/assets/gallery/gallery5.jpeg";

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

const HERO_TITLE = lt(
  "What Happens When You Call",
  "कॉल करने पर क्या होता है",
  "మీరు కాల్ చేస్తే ఏమి జరుగుతుంది",
  "તમે કૉલ કરો ત્યારે શું થાય છે",
  "کال کرنے پر کیا ہوتا ہے",
  "ڪال ڪرڻ تي ڇا ٿيندو آهي",
);

const HERO_SUBTITLE = lt(
  "From the moment you dial to the moment your case is closed — here is exactly what happens.",
  "जिस क्षण आप डायल करते हैं उससे लेकर आपका मामला बंद होने तक — यहां बिल्कुल वही है जो होता है।",
  "మీరు డయల్ చేసిన క్షణం నుండి మీ కేసు మూసివేయబడే వరకు — ఇక్కడ సరిగ్గా ఏమి జరుగుతుందో ఉంది.",
  "તમે ડાયલ કરો છો તે ક્ષણથી લઈને તમારો કેસ બંધ થાય ત્યાં સુધી — અહીં બરાબર શું થાય છે તે છે.",
  "جس لمحے آپ ڈائل کرتے ہیں سے لے کر آپ کا کیس بند ہونے تک — یہاں بالکل وہی ہے جو ہوتا ہے۔",
  "جنهن پل توهان ڊائل ڪريو ٿا کان وٺي توهان جو ڪيس بند ٿيڻ تائين — هتي بلڪل اهو آهي جيڪو ٿئي ٿو.",
);

const DODONT_HEADING = lt(
  "Do's and Don'ts While Calling",
  "कॉल करते समय क्या करें और क्या न करें",
  "కాల్ చేసేటప్పుడు చేయవలసినవి మరియు చేయకూడనివి",
  "કૉલ કરતી વખતે શું કરવું અને શું ન કરવું",
  "کال کرتے وقت کیا کریں اور کیا نہ کریں",
  "ڪال ڪرڻ وقت ڇا ڪجي ۽ ڇا نه ڪجي",
);

export function WhatHappens() {
  const t = useT();
  const dos = doDonts.filter((d) => d.kind === "do");
  const donts = doDonts.filter((d) => d.kind === "dont");

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/80 to-navy-950/60" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection>
            <span className="inline-flex items-center gap-2 text-accent-400 dark:text-white rounded-full border border-accent-400/40 bg-navy-950/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-300 uppercase backdrop-blur">
              <FaRoute size={12} /> {t(ui.nav.getHelp)}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">{t(HERO_TITLE)}</h1>
            <p className="mt-4 text-lg text-navy-300">{t(HERO_SUBTITLE)}</p>
          </MotionSection>
        </div>
        <div className="absolute inset-x-0 -bottom-1 h-10 rounded-t-[2.5rem] bg-white sm:h-14 dark:bg-navy-950" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Timeline steps={journeySteps} />
      </section>

      <section className="bg-navy-50 py-16 dark:bg-navy-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="text-center">
            <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50 sm:text-3xl">{t(DODONT_HEADING)}</h2>
          </MotionSection>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <StaggerGroup className="space-y-3">
              {dos.map((item) => (
                <motion.div
                  key={item.text.en}
                  variants={staggerItem}
                  className="flex items-start gap-3 rounded-xl border border-success-500/20 bg-white p-4 shadow-sm dark:bg-navy-800"
                >
                  <FaCircleCheck className="mt-0.5 flex-none text-success-500" size={18} />
                  <p className="text-sm text-navy-700 dark:text-navy-200">{t(item.text)}</p>
                </motion.div>
              ))}
            </StaggerGroup>
            <StaggerGroup className="space-y-3">
              {donts.map((item) => (
                <motion.div
                  key={item.text.en}
                  variants={staggerItem}
                  className="flex items-start gap-3 rounded-xl border border-emergency-500/20 bg-white p-4 shadow-sm dark:bg-navy-800"
                >
                  <FaCircleXmark className="mt-0.5 flex-none text-emergency-500" size={18} />
                  <p className="text-sm text-navy-700 dark:text-navy-200">{t(item.text)}</p>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
          <div className="mt-12 flex justify-center">
            <EmergencyButton size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
