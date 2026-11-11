import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FaCircleExclamation,
  FaTriangleExclamation,
  FaChildReaching,
  FaCarBurst,
  FaFireFlameCurved,
  FaTruckMedical,
  FaMagnifyingGlass,
  FaBoltLightning,
  FaPersonCane,
  FaCity,
  FaUniversalAccess,
  FaPhone,
  FaCircleXmark,
} from "react-icons/fa6";
import { LuShieldAlert } from "react-icons/lu";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { situations } from "@/data/situations";
import { integratedHelplines } from "@/data/helplines";
import { useT } from "@/contexts/LanguageContext";
import type { LocalizedText } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import heroImg from "@/assets/gallery/gallery5.jpeg";

const SITUATION_ICONS: IconType[] = [
  LuShieldAlert,
  FaTriangleExclamation,
  FaChildReaching,
  FaCarBurst,
  FaFireFlameCurved,
  FaTruckMedical,
  FaMagnifyingGlass,
  FaBoltLightning,
  FaPersonCane,
  FaCity,
  FaUniversalAccess,
];

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

const HERO_TITLE = lt("When to Call 112", "112 कब डायल करें", "112కు ఎప్పుడు డయల్ చేయాలి", "112 ક્યારે ડાયલ કરવો", "112 کب ڈائل کریں", "112 ڪڏهن ڊائل ڪجي");

const HERO_SUBTITLE = lt(
  "Not sure if your situation qualifies? Here are the kinds of emergencies Dial 112 handles — and a few things it doesn't.",
  "पक्का नहीं कि आपकी स्थिति योग्य है? यहां उन आपात स्थितियों के प्रकार हैं जिन्हें डायल 112 संभालता है — और कुछ जो नहीं।",
  "మీ పరిస్థితి అర్హత కలిగి ఉందో లేదో తెలియదా? డయల్ 112 నిర్వహించే అత్యవసర పరిస్థితుల రకాలు ఇక్కడ ఉన్నాయి — మరియు కొన్ని నిర్వహించనివి కూడా.",
  "તમારી પરિસ્થિતિ લાયક છે કે નહીં તેની ખાતરી નથી? અહીં ડાયલ 112 જે પ્રકારની કટોકટીઓ સંભાળે છે તે છે — અને થોડીક જે નથી.",
  "یقین نہیں کہ آپ کی صورتحال اہل ہے؟ یہاں ان ایمرجنسیوں کی اقسام ہیں جو ڈائل 112 سنبھالتا ہے — اور کچھ جو نہیں۔",
  "پڪ ناهي ته توهان جي حالت لائق آهي؟ هتي انهن ايمرجنسين جا قسم آهن جيڪي ڊائل 112 سنڀالي ٿو — ۽ ڪجهه جيڪي نه ٿو سنڀالي.",
);

const REASSURANCE = lt(
  "If you are not sure whether it is an emergency — call. Our trained officers will guide you or direct you to the right service. It is always better to call than to wait.",
  "अगर आप निश्चित नहीं हैं कि यह आपात स्थिति है — कॉल करें। हमारे प्रशिक्षित अधिकारी आपका मार्गदर्शन करेंगे या आपको सही सेवा तक निर्देशित करेंगे। इंतजार करने से बेहतर है कॉल करना।",
  "ఇది అత్యవసర పరిస్థితా కాదా అని మీకు తెలియకపోతే — కాల్ చేయండి. మా శిక్షణ పొందిన అధికారులు మీకు మార్గనిర్దేశం చేస్తారు లేదా సరైన సేవకు మిమ్మల్ని నడిపిస్తారు. వేచి ఉండటం కంటే కాల్ చేయడం ఎల్లప్పుడూ మంచిది.",
  "જો તમને ખાતરી ન હોય કે તે કટોકટી છે કે નહીં — કૉલ કરો. અમારા પ્રશિક્ષિત અધિકારીઓ તમને માર્ગદર્શન આપશે અથવા યોગ્ય સેવા તરફ દોરી જશે. રાહ જોવા કરતાં કૉલ કરવો હંમેશા સારું છે.",
  "اگر آپ کو یقین نہیں کہ یہ ایمرجنسی ہے — کال کریں۔ ہمارے تربیت یافتہ افسران آپ کی رہنمائی کریں گے یا آپ کو صحیح خدمت کی طرف رہنمائی کریں گے۔ انتظار کرنے سے کال کرنا ہمیشہ بہتر ہے۔",
  "جيڪڏهن توهان کي پڪ ناهي ته اهو ايمرجنسي آهي — ڪال ڪريو. اسان جا تربيت يافته آفيسر توهان جي رهنمائي ڪندا يا توهان کي صحيح خدمت ڏانهن رهنمائي ڪندا. انتظار ڪرڻ کان ڪال ڪرڻ هميشه بهتر آهي.",
);

const NOT_FOR_HEADING = lt(
  "When NOT to Use 112",
  "112 का उपयोग कब न करें",
  "112ని ఎప్పుడు ఉపయోగించకూడదు",
  "112 નો ઉપયોગ ક્યારે ન કરવો",
  "112 کب استعمال نہ کریں",
  "112 ڪڏهن استعمال نه ڪجي",
);

const NOT_FOR_INTRO = lt(
  "Keeping emergency lines free is just as important. Please avoid calling 112 for:",
  "आपातकालीन लाइनों को खाली रखना भी उतना ही महत्वपूर्ण है। कृपया इनके लिए 112 पर कॉल करने से बचें:",
  "అత్యవసర లైన్‌లను ఖాళీగా ఉంచడం కూడా అంతే ముఖ్యం. దయచేసి వీటి కోసం 112కు కాల్ చేయడం మానుకోండి:",
  "કટોકટીની લાઇનો ખાલી રાખવી પણ એટલી જ મહત્વપૂર્ણ છે. કૃપા કરીને આના માટે 112 પર કૉલ કરવાનું ટાળો:",
  "ایمرجنسی لائنوں کو خالی رکھنا بھی اتنا ہی اہم ہے۔ براہ کرم ان کے لیے 112 پر کال کرنے سے گریز کریں:",
  "ايمرجنسي لائينن کي خالي رکڻ به اوترو ئي اهم آهي. مهرباني ڪري انهن لاءِ 112 تي ڪال ڪرڻ کان پاسو ڪريو:",
);

const NOT_FOR_ITEMS: LocalizedText[] = [
  lt(
    "Enquiries — train timings, exam results, address searches",
    "पूछताछ — ट्रेन का समय, परीक्षा परिणाम, पता खोजना",
    "విచారణలు — రైలు సమయాలు, పరీక్షా ఫలితాలు, చిరునామా శోధనలు",
    "પૂછપરછ — ટ્રેન સમય, પરીક્ષા પરિણામો, સરનામું શોધ",
    "استفسارات — ٹرین کے اوقات، امتحانی نتائج، پتے کی تلاش",
    "پڇا ڳاڇا — ٽرين جو وقت، امتحان جا نتيجا، پتي جي ڳولا",
  ),
  lt(
    "Prank calls or testing whether the number works",
    "मज़ाक कॉल या यह जांचना कि नंबर काम करता है या नहीं",
    "ప్రాంక్ కాల్స్ లేదా నంబర్ పనిచేస్తుందో లేదో పరీక్షించడం",
    "મજાક કૉલ અથવા નંબર કામ કરે છે કે નહીં તે ચકાસવું",
    "شرارتی کالز یا یہ جانچنا کہ نمبر کام کرتا ہے یا نہیں",
    "شرارتي ڪالون يا اهو جانچڻ ته نمبر ڪم ڪري ٿو يا نه",
  ),
  lt(
    "Blank or hoax calls — they delay help for someone whose life may be in danger, and are punishable under law",
    "खाली या फर्जी कॉल — ये किसी की जान जोखिम में होने पर मदद में देरी करते हैं, और कानूनन दंडनीय हैं",
    "ఖాళీ లేదా బూటకపు కాల్స్ — ఇవి ప్రాణాపాయంలో ఉన్నవారికి సహాయం ఆలస్యం చేస్తాయి మరియు చట్టం ప్రకారం శిక్షార్హం",
    "ખાલી અથવા બનાવટી કૉલ — આ કોઈનું જીવન જોખમમાં હોય ત્યારે મદદમાં વિલંબ કરે છે, અને કાયદા હેઠળ સજાપાત્ર છે",
    "خالی یا جھوٹی کالز — یہ کسی کی جان خطرے میں ہونے پر مدد میں تاخیر کرتی ہیں، اور قانون کے تحت قابل سزا ہیں",
    "خالي يا ٺڳيءَ واريون ڪالون — اهي ڪنهن جي جان خطري ۾ هجڻ تي مدد ۾ دير ڪن ٿيون، ۽ قانون هيٺ سزا وارو ڏوهه آهن",
  ),
];

const HELPLINES_HEADING = lt(
  "Directory of Other Helplines",
  "अन्य हेल्पलाइन निर्देशिका",
  "ఇతర హెల్ప్‌లైన్‌ల డైరెక్టరీ",
  "અન્ય હેલ્પલાઇન ડિરેક્ટરી",
  "دیگر ہیلپ لائنوں کی ڈائرکٹری",
  "ٻين مدد لائينن جي ڊائريڪٽري",
);

export function WhenToCall() {
  const t = useT();

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/80 to-navy-950/60" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection>
            <span className="inline-flex items-center gap-2 text-accent-400 dark:text-white rounded-full border border-accent-400/40 bg-navy-950/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-300 uppercase backdrop-blur">
              <FaCircleExclamation size={12} /> {t(ui.nav.getHelp)}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">{t(HERO_TITLE)}</h1>
            <p className="mt-4 text-lg text-navy-300">{t(HERO_SUBTITLE)}</p>
          </MotionSection>
        </div>
        <div className="absolute inset-x-0 -bottom-1 h-10 rounded-t-[2.5rem] bg-white sm:h-14 dark:bg-navy-950" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {situations.map((situation, i) => {
            const Icon = SITUATION_ICONS[i];
            return (
              <motion.div
                key={situation.title.en}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-linear-to-br from-emergency-600 to-emergency-400 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon size={19} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy-900 dark:text-navy-50">{t(situation.title)}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {situation.examples.map((ex) => (
                    <li key={ex.en} className="rounded-full bg-navy-50 px-2.5 py-1 text-xs text-navy-600 dark:bg-navy-800/60 dark:text-navy-300">
                      {t(ex)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </StaggerGroup>

        <MotionSection className="mt-12 flex items-start gap-4 rounded-2xl bg-brand-600 p-6 text-white sm:p-8">
          <FaPhone size={22} className="mt-1 flex-none text-accent-300" />
          <p className="text-base leading-relaxed sm:text-lg">{t(REASSURANCE)}</p>
        </MotionSection>
      </section>

      <section className="bg-navy-50 py-16 dark:bg-navy-900/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-navy-900 dark:text-navy-50">
              <FaCircleXmark className="text-emergency-500" size={20} />
              {t(NOT_FOR_HEADING)}
            </h2>
            <p className="mt-2 text-navy-500 dark:text-navy-400">{t(NOT_FOR_INTRO)}</p>
            <StaggerGroup className="mt-6 space-y-3">
              {NOT_FOR_ITEMS.map((item) => (
                <motion.div
                  key={item.en}
                  variants={staggerItem}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-navy-800"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emergency-500/15 text-emergency-600 dark:text-emergency-400">
                    <FaCircleXmark size={11} />
                  </span>
                  <p className="text-sm text-navy-700 dark:text-navy-200">{t(item)}</p>
                </motion.div>
              ))}
            </StaggerGroup>
          </MotionSection>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{t(HELPLINES_HEADING)}</h2>
            <StaggerGroup className="mt-6 grid gap-2 sm:grid-cols-2">
              {integratedHelplines.map((h) => (
                <motion.div
                  key={h.en}
                  variants={staggerItem}
                  className="rounded-lg bg-navy-50 px-3 py-2.5 text-sm text-navy-700 dark:bg-navy-900/40 dark:text-navy-200"
                >
                  {t(h)}
                </motion.div>
              ))}
            </StaggerGroup>
          </MotionSection>
          <div className="mt-10 flex justify-center">
            <EmergencyButton size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
