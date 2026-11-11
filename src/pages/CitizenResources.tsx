import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FaCircleQuestion, FaCircleCheck, FaBan, FaBookOpen, FaChildren, FaVideo, FaCalendarDays } from "react-icons/fa6";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { Accordion } from "@/components/ui/Accordion";
import { faqs, mythsFacts } from "@/data/faqs";
import { useT } from "@/contexts/LanguageContext";
import type { LocalizedText } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import heroImg from "@/assets/gallery/gallery5.jpeg";

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

const HERO_TITLE = lt("Citizen Resources", "नागरिक संसाधन", "పౌర వనరులు", "નાગરિક સંસાધનો", "شہری وسائل", "شهري وسيلا");

const HERO_SUBTITLE = lt(
  "Answers to common questions, myths worth clearing up, and how we keep citizens informed year-round.",
  "सामान्य प्रश्नों के उत्तर, स्पष्ट करने योग्य मिथक, और हम पूरे साल नागरिकों को कैसे सूचित रखते हैं।",
  "సాధారణ ప్రశ్నలకు సమాధానాలు, స్పష్టం చేయదగిన అపోహలు, మరియు మేము ఏడాది పొడవునా పౌరులను ఎలా తెలియజేస్తాము.",
  "સામાન્ય પ્રશ્નોના જવાબો, સ્પષ્ટ કરવા યોગ્ય દંતકથાઓ, અને અમે વર્ષભર નાગરિકોને કેવી રીતે માહિતગાર રાખીએ છીએ.",
  "عام سوالات کے جوابات، واضح کرنے کے قابل خرافات، اور ہم سال بھر شہریوں کو کیسے باخبر رکھتے ہیں۔",
  "عام سوالن جا جواب، صاف ڪرڻ جوڳيون ڏند ڪٿائون، ۽ اسان سال دوران شهرين کي ڪيئن باخبر رکون ٿا.",
);

const FAQ_HEADING = lt("Frequently Asked Questions", "अक्सर पूछे जाने वाले प्रश्न", "తరచుగా అడిగే ప్రశ్నలు", "વારંવાર પૂછાતા પ્રશ્નો", "اکثر پوچھے گئے سوالات", "اڪثر پڇيا ويندڙ سوال");

const MYTHS_HEADING = lt("Myths vs Facts", "मिथक बनाम तथ्य", "అపోహలు vs వాస్తవాలు", "દંતકથાઓ વિરુદ્ધ હકીકતો", "خرافات بمقابلہ حقائق", "ڏند ڪٿائون بمقابل حقيقتون");

const AWARENESS_HEADING = lt(
  "Awareness & Education",
  "जागरूकता एवं शिक्षा",
  "అవగాహన & విద్య",
  "જાગૃતિ અને શિક્ષણ",
  "آگاہی اور تعلیم",
  "آگاهي ۽ تعليم",
);

type AwarenessCard = { icon: IconType; title: LocalizedText; body: LocalizedText };

const AWARENESS_CARDS: AwarenessCard[] = [
  {
    icon: FaBookOpen,
    title: lt("Posters for Public Spaces", "सार्वजनिक स्थानों के लिए पोस्टर", "ప్రజా ప్రదేశాల కోసం పోస్టర్లు", "જાહેર સ્થળો માટે પોસ્ટર", "عوامی مقامات کے لیے پوسٹرز", "عوامي جڳهن لاءِ پوسٽر"),
    body: lt(
      "Bilingual posters (Telugu and English) are shared with schools, RWAs, gram panchayats, bus stands and hospitals as part of our awareness drive.",
      "द्विभाषी पोस्टर (तेलुगु एवं अंग्रेजी) हमारे जागरूकता अभियान के हिस्से के रूप में स्कूलों, आरडब्ल्यूए, ग्राम पंचायतों, बस स्टैंड एवं अस्पतालों के साथ साझा किए जाते हैं।",
      "మా అవగాహన కార్యక్రమంలో భాగంగా ద్విభాషా పోస్టర్‌లు (తెలుగు మరియు ఇంగ్లీష్) పాఠశాలలు, RWAలు, గ్రామ పంచాయతీలు, బస్ స్టాండ్‌లు మరియు ఆసుపత్రులతో పంచుకోబడతాయి.",
      "અમારા જાગૃતિ અભિયાનના ભાગ રૂપે દ્વિભાષી પોસ્ટર (તેલુગુ અને અંગ્રેજી) શાળાઓ, RWA, ગ્રામ પંચાયતો, બસ સ્ટેન્ડ અને હોસ્પિટલો સાથે શેર કરવામાં આવે છે.",
      "ہماری آگاہی مہم کے حصے کے طور پر دو لسانی پوسٹرز (تیلگو اور انگریزی) اسکولوں، RWAs، گرام پنچایتوں، بس اسٹینڈز اور ہسپتالوں کے ساتھ شیئر کیے جاتے ہیں۔",
      "اسان جي آگاهي مهم جي حصي طور ٻه لساني پوسٽر (تيلگو ۽ انگريزي) اسڪولن، RWAs، ڳوٺ پنچايتن، بس اسٽينڊن ۽ اسپتالن سان شيئر ڪيا ويندا آهن.",
    ),
  },
  {
    icon: FaChildren,
    title: lt("Teach Your Child 112", "अपने बच्चे को 112 सिखाएं", "మీ పిల్లలకు 112 నేర్పండి", "તમારા બાળકને 112 શીખવો", "اپنے بچے کو 112 سکھائیں", "پنهنجي ٻار کي 112 سيکاريو"),
    body: lt(
      "A dedicated children's corner helps parents teach kids when and how to reach 112, in simple, memorable language.",
      "एक समर्पित बाल कोना माता-पिता को यह सिखाने में मदद करता है कि बच्चों को कब एवं कैसे 112 तक पहुंचना है, सरल एवं यादगार भाषा में।",
      "ఒక ప్రత్యేక పిల్లల మూల తల్లిదండ్రులకు పిల్లలకు 112ను ఎప్పుడు మరియు ఎలా చేరుకోవాలో సరళమైన, గుర్తుండిపోయే భాషలో నేర్పించడంలో సహాయపడుతుంది.",
      "એક સમર્પિત બાળ ખૂણો માતાપિતાને બાળકોને 112 ક્યારે અને કેવી રીતે પહોંચવું તે સરળ, યાદગાર ભાષામાં શીખવવામાં મદદ કરે છે.",
      "ایک مخصوص بچوں کا کونا والدین کو بچوں کو یہ سکھانے میں مدد کرتا ہے کہ 112 تک کب اور کیسے پہنچنا ہے، آسان، یادگار زبان میں۔",
      "هڪ خاص ٻارن جو ڪنڊ والدين کي ٻارن کي اهو سيکارڻ ۾ مدد ڪري ٿو ته 112 تائين ڪڏهن ۽ ڪيئن پھچجي، سادي، ياد رهندڙ ٻولي ۾.",
    ),
  },
  {
    icon: FaVideo,
    title: lt("Explainer Video", "व्याख्या वीडियो", "వివరణ వీడియో", "સમજૂતી વિડિયો", "وضاحتی ویڈیو", "وضاحتي وڊيو"),
    body: lt(
      "A short explainer video walks citizens through how to call, what to say, and what happens next.",
      "एक छोटा व्याख्या वीडियो नागरिकों को बताता है कि कैसे कॉल करें, क्या कहें, एवं आगे क्या होता है।",
      "ఒక చిన్న వివరణ వీడియో పౌరులకు ఎలా కాల్ చేయాలో, ఏమి చెప్పాలో మరియు తర్వాత ఏమి జరుగుతుందో తెలియజేస్తుంది.",
      "એક ટૂંકો સમજૂતી વિડિયો નાગરિકોને કૉલ કેવી રીતે કરવો, શું કહેવું અને પછી શું થાય છે તે સમજાવે છે.",
      "ایک مختصر وضاحتی ویڈیو شہریوں کو بتاتی ہے کہ کال کیسے کریں، کیا کہیں، اور اس کے بعد کیا ہوتا ہے۔",
      "هڪ مختصر وضاحتي وڊيو شهرين کي ٻڌائي ٿي ته ڪال ڪيئن ڪجي، ڇا چئجي، ۽ ان کان پوءِ ڇا ٿيندو.",
    ),
  },
  {
    icon: FaCalendarDays,
    title: lt("Year-round Campaigns", "साल भर के अभियान", "సంవత్సరం పొడవునా ప్రచారాలు", "વર્ષભરના અભિયાનો", "سال بھر کی مہمات", "سال دوران مهمون"),
    body: lt(
      "Awareness activities are timed around Road Safety Week, Women's Day and 112 Day observances throughout the year.",
      "जागरूकता गतिविधियां सड़क सुरक्षा सप्ताह, महिला दिवस एवं 112 दिवस के अवसरों के आसपास पूरे साल आयोजित की जाती हैं।",
      "అవగాహన కార్యక్రమాలు రోడ్ సేఫ్టీ వీక్, మహిళా దినోత్సవం మరియు 112 దినోత్సవ వేడుకల చుట్టూ ఏడాది పొడవునా నిర్వహించబడతాయి.",
      "જાગૃતિ પ્રવૃત્તિઓ રોડ સેફ્ટી વીક, મહિલા દિવસ અને 112 દિવસની ઉજવણીની આસપાસ વર્ષભર ગોઠવવામાં આવે છે.",
      "آگاہی سرگرمیاں روڈ سیفٹی ویک، ویمنز ڈے اور 112 ڈے کی تقریبات کے ارد گرد سال بھر ترتیب دی جاتی ہیں۔",
      "آگاهي سرگرميون روڊ سيفٽي ويڪ، عورتن جي ڏينهن ۽ 112 ڏينهن جي موقعن جي چوڌاري سال دوران رکيون وينديون آهن.",
    ),
  },
];

export function CitizenResources() {
  const t = useT();

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/80 to-navy-950/60" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection>
            <span className="inline-flex items-center gap-2 text-accent-400 dark:text-white rounded-full border border-accent-400/40 bg-navy-950/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-300 uppercase backdrop-blur">
              <FaCircleQuestion size={12} /> {t(ui.nav.getHelp)}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">{t(HERO_TITLE)}</h1>
            <p className="mt-4 text-lg text-navy-300">{t(HERO_SUBTITLE)}</p>
          </MotionSection>
        </div>
        <div className="absolute inset-x-0 -bottom-1 h-10 rounded-t-[2.5rem] bg-white sm:h-14 dark:bg-navy-950" />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <MotionSection>
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{t(FAQ_HEADING)}</h2>
          <div className="mt-6">
            <Accordion items={faqs.map((f) => ({ heading: f.question, body: f.answer }))} defaultOpenIndex={-1} />
          </div>
        </MotionSection>
      </section>

      <section className="bg-navy-50 py-16 dark:bg-navy-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="text-center">
            <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{t(MYTHS_HEADING)}</h2>
          </MotionSection>
          <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            {mythsFacts.map((mf) => (
              <motion.div
                key={mf.myth.en}
                variants={staggerItem}
                className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-navy-800"
              >
                <div className="flex items-start gap-3 border-b border-navy-100 bg-emergency-50/60 p-4 dark:border-navy-700 dark:bg-emergency-900/10">
                  <FaBan className="mt-0.5 flex-none text-emergency-500" size={16} />
                  <p className="text-sm text-navy-600 line-through decoration-emergency-400 dark:text-navy-300">{t(mf.myth)}</p>
                </div>
                <div className="flex items-start gap-3 p-4">
                  <FaCircleCheck className="mt-0.5 flex-none text-success-500" size={16} />
                  <p className="text-sm font-medium text-navy-800 dark:text-navy-100">{t(mf.fact)}</p>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="text-center">
            <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{t(AWARENESS_HEADING)}</h2>
          </MotionSection>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AWARENESS_CARDS.map((card) => (
              <motion.div
                key={card.title.en}
                variants={staggerItem}
                className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <card.icon size={19} />
                </span>
                <h3 className="mt-4 font-display font-semibold text-navy-900 dark:text-navy-50">{t(card.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500 dark:text-navy-400">{t(card.body)}</p>
              </motion.div>
            ))}
          </StaggerGroup>
          <div className="mt-12 flex justify-center">
            <EmergencyButton size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
