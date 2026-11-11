import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FaPhone,
  FaLocationDot,
  FaEnvelope,
  FaLaptop,
  FaClock,
  FaShieldHalved,
  FaGlobe,
  FaFacebook,
  FaXTwitter,
  FaHeadset,
  FaCommentDots,
  FaScaleBalanced,
  FaNewspaper,
  FaChildReaching,
  FaTruckMedical,
  FaFireExtinguisher,
} from "react-icons/fa6";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { contactInfo } from "@/data/contact";
import { EMERGENCY_NUMBER, socialLinks } from "@/data/nav";
import { useT } from "@/contexts/LanguageContext";
import type { LocalizedText } from "@/i18n/locales";
import contactHero from "@/assets/gallery/gallery1.jpeg";
import telanganaPoliceLogo from "@/assets/logo.png";

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

const HERO_KICKER = lt("24/7 Support", "24/7 सहायता", "24/7 మద్దతు", "24/7 સહાય", "24/7 مدد", "24/7 مدد");
const HERO_TITLE_PREFIX = lt("Get in", "तेलंगाना पुलिस से", "తెలంగాణ పోలీసుతో", "તેલંગાણા પોલીસ સાથે", "تلنگانہ پولیس سے", "تلنگانا پوليس سان");
const HERO_TITLE_HIGHLIGHT = lt("Touch", "संपर्क", "సంప్రదింపు", "સંપર્કમાં", "رابطہ", "رابطو");
const HERO_TITLE_SUFFIX = lt("with Telangana Police", "करें", "పొందండి", "રહો", "کریں", "ڪريو");

const HERO_SUBTITLE = lt(
  "Reach Telangana Police Emergency Services 24/7 via phone, email, social media, or our Hyderabad headquarters. We're here to serve 3.5 crore residents across all states.",
  "फोन, ईमेल, सोशल मीडिया या हमारे हैदराबाद मुख्यालय के माध्यम से तेलंगाना पुलिस आपातकालीन सेवाओं तक 24/7 पहुंचें। हम सभी राज्यों में 3.5 करोड़ निवासियों की सेवा के लिए यहां हैं।",
  "ఫోన్, ఇమెయిల్, సోషల్ మీడియా లేదా మా హైదరాబాద్ ప్రధాన కార్యాలయం ద్వారా తెలంగాణ పోలీసు అత్యవసర సేవలను 24/7 అందుకోండి. మేము అన్ని రాష్ట్రాల్లోని 3.5 కోట్ల నివాసితులకు సేవ చేయడానికి ఇక్కడ ఉన్నాము.",
  "ફોન, ઈમેલ, સોશિયલ મીડિયા અથવા અમારા હૈદરાબાદ મુખ્યાલય દ્વારા તેલંગાણા પોલીસ કટોકટી સેવાઓ સુધી 24/7 પહોંચો. અમે તમામ રાજ્યોમાં 3.5 કરોડ રહેવાસીઓની સેવા માટે અહીં છીએ.",
  "فون، ای میل، سوشل میڈیا یا ہمارے حیدرآباد ہیڈکوارٹرز کے ذریعے تلنگانہ پولیس ایمرجنسی خدمات تک 24/7 رسائی حاصل کریں۔ ہم تمام ریاستوں میں 3.5 کروڑ رہائشیوں کی خدمت کے لیے یہاں موجود ہیں۔",
  "فون، اي ميل، سوشل ميڊيا يا اسان جي حيدرآباد هيڊڪوارٽرز ذريعي تلنگانا پوليس ايمرجنسي خدمتن تائين 24/7 رسائي ڪريو. اسين سمورين رياستن ۾ 3.5 ڪروڙ رهاڪن جي خدمت لاءِ هتي آهيون.",
);

const QUICK_EMERGENCY_LABEL = lt("Emergency", "आपातकाल", "అత్యవసరం", "કટોકટી", "ایمرجنسی", "ايمرجنسي");
const QUICK_EMERGENCY_CAPTION = lt("Available 24/7", "24/7 उपलब्ध", "24/7 అందుబాటులో", "24/7 ઉપલબ્ધ", "24/7 دستیاب", "24/7 موجود");
const QUICK_HELPLINE_LABEL = lt("Women's Helpline", "महिला हेल्पलाइन", "మహిళా హెల్ప్‌లైన్", "મહિલા હેલ્પલાઇન", "خواتین ہیلپ لائن", "عورتن جي مدد لائن");
const QUICK_HELPLINE_CAPTION = lt("24/7 Safety Support", "24/7 सुरक्षा सहायता", "24/7 భద్రతా మద్దతు", "24/7 સલામતી સહાય", "24/7 حفاظتی معاونت", "24/7 حفاظتي مدد");
const QUICK_CYBERCRIME_LABEL = lt("Cyber Crime Helpline", "साइबर अपराध हेल्पलाइन", "సైబర్ నేరాల హెల్ప్‌లైన్", "સાયબર ક્રાઇમ હેલ્પલાઇન", "سائبر کرائم ہیلپ لائن", "سائبر ڪرائيم مدد لائين");
const QUICK_CYBERCRIME_CAPTION = lt("National Helpline", "राष्ट्रीय हेल्पलाइन", "జాతీయ హెల్ప్‌లైన్", "રાષ્ટ્રીય હેલ્પલાઇન", "قومی ہیلپ لائن", "قومي مدد لائين");
const QUICK_EMAIL_LABEL = lt("Email", "ईमेल", "ఇమెయిల్", "ઇમેઇલ", "ای میل", "اي ميل");
const QUICK_FIRE_LABEL = lt("Fire", "अग्निशमन", "అగ్నిమాపక", "ફાયર", "فائر", "فائر");
const QUICK_FIRE_CAPTION = lt("Available 24/7", "24/7 उपलब्ध", "24/7 అందుబాటులో", "24/7 ઉપલબ્ધ", "24/7 دستیاب", "24/7 موجود");
const QUICK_CHILD_LABEL = lt("Child Helpline", "बाल हेल्पलाइन", "శిశు హెల్ప్‌లైన్", "બાળ હેલ્પલાઇન", "چائلڈ ہیلپ لائن", "ٻارن جي مدد لائن");
const QUICK_CHILD_CAPTION = lt("24/7 Child Safety", "24/7 बाल सुरक्षा", "24/7 శిశు భద్రత", "24/7 બાળ સલામતી", "24/7 بچوں کی حفاظت", "24/7 ٻارن جي حفاظت");
const QUICK_MEDICAL_LABEL = lt("Medical / Ambulance", "चिकित्सा / एम्बुलेंस", "వైద్య / అంబులెన్స్", "તબીબી / એમ્બ્યુલન્સ", "طبی / ایمبولینس", "طبي / ايمبيولنس");
const QUICK_MEDICAL_CAPTION = lt("Available 24/7", "24/7 उपलब्ध", "24/7 అందుబాటులో", "24/7 ઉપલબ્ધ", "24/7 دستیاب", "24/7 موجود");

const CHANNELS_KICKER = lt("Contact Channels", "संपर्क माध्यम", "సంప్రదింపు మార్గాలు", "સંપર્ક માધ્યમો", "رابطہ کے ذرائع", "رابطي جا ذريعا");
const CHANNELS_HEADING = lt(
  "Ways to Reach Us",
  "हम तक पहुंचने के तरीके",
  "మమ్మల్ని సంప్రదించే మార్గాలు",
  "અમારો સંપર્ક કરવાની રીતો",
  "ہم تک پہنچنے کے طریقے",
  "اسان تائين پھچڻ جا طريقا",
);
const CHANNELS_SUBTITLE = lt(
  "Multiple contact options for residents inside and outside Telangana, plus our Public Safety Answering Point (PSAP).",
  "तेलंगाना के अंदर और बाहर के निवासियों के लिए कई संपर्क विकल्प, साथ ही हमारा कमांड एवं नियंत्रण केंद्र।",
  "తెలంగాణ లోపల మరియు వెలుపల నివసించే వారి కోసం అనేక సంప్రదింపు మార్గాలు, అలాగే మా కమాండ్ అండ్ కంట్రోల్ సెంటర్.",
  "તેલંગાણાની અંદર અને બહારના રહેવાસીઓ માટે અનેક સંપર્ક વિકલ્પો, ઉપરાંત અમારું કમાન્ડ અને કંટ્રોલ સેન્ટર.",
  "تلنگانہ کے اندر اور باہر کے رہائشیوں کے لیے متعدد رابطہ کے اختیارات، ساتھ ہی ہمارا کمانڈ اینڈ کنٹرول سینٹر۔",
  "تلنگانا جي اندر ۽ ٻاهر جي رهاڪن لاءِ ڪيترائي رابطي جا اختيار، سان گڏ اسان جو ڪمانڊ ۽ ڪنٽرول سينٽر.",
);

const FROM_TELANGANA_TITLE = lt("From Telangana", "तेलंगाना से", "తెలంగాణ నుండి", "તેલંગાણાથી", "تلنگانہ سے", "تلنگانا کان");
const FROM_OUTSIDE_TELANGANA_TITLE = lt(
  "From Outside Telangana",
  "तेलंगाना के बाहर से",
  "తెలంగాణ వెలుపల నుండి",
  "તેલંગાણાની બહારથી",
  "تلنگانہ سے باہر",
  "تلنگانا کان ٻاهران",
);
const COMMAND_CENTRE_TITLE = lt(
  "Public Safety Answering Point (PSAP)",
  "कमांड एवं नियंत्रण केंद्र",
  "కమాండ్ మరియు కంట్రోల్ సెంటర్",
  "કમાન્ડ અને કંટ્રોલ સેન્ટર",
  "کمانڈ اینڈ کنٹرول سینٹر",
  "ڪمانڊ ۽ ڪنٽرول سينٽر",
);

const EMERGENCY_SUFFIX_SHORT = lt(" — Emergency", " — आपातकाल", " — అత్యవసరం", " — કટોકટી", " — ایمرجنسی", " — ايمرجنسي");
const FACEBOOK_PAGE_LABEL = lt(
  "Dial 112 Facebook Page",
  "डायल 112 फेसबुक पेज",
  "డయల్ 112 ఫేస్‌బుక్ పేజీ",
  "ડાયલ 112 ફેસબુક પેજ",
  "ڈائل 112 فیس بک پیج",
  "ڊائل 112 فيسبڪ پيج",
);
const TWITTER_PAGE_LABEL = lt(
  "Dial 112 Twitter Page",
  "डायल 112 ट्विटर पेज",
  "డయల్ 112 ట్విటర్ పేజీ",
  "ડાયલ 112 ટ્વિટર પેજ",
  "ڈائل 112 ٹویٹر پیج",
  "ڊائل 112 ٽوئيٽر پيج",
);

const OTHER_HELPLINES_KICKER = lt(
  "More Numbers",
  "अधिक नंबर",
  "మరిన్ని నంబర్లు",
  "વધુ નંબરો",
  "مزید نمبر",
  "وڌيڪ نمبر",
);
const OTHER_HELPLINES_HEADING = lt(
  "Other Emergency Helplines",
  "अन्य आपातकालीन हेल्पलाइन",
  "ఇతర అత్యవసర హెల్ప్‌లైన్‌లు",
  "અન્ય કટોકટી હેલ્પલાઇન",
  "دیگر ایمرجنسی ہیلپ لائنیں",
  "ٻيون ايمرجنسي مدد لائينون",
);

const otherHelplines: { label: LocalizedText; phone: string }[] = [
  {
    label: lt("Women's Helpline", "महिला हेल्पलाइन", "మహిళా హెల్ప్‌లైన్", "મહિલા હેલ્પલાઇન", "خواتین ہیلپ لائن", "عورتن جي مدد لائن"),
    phone: "181",
  },
  {
    label: lt("Child Helpline", "बाल हेल्पलाइन", "శిశు హెల్ప్‌లైన్", "બાળ હેલ્પલાઇન", "چائلڈ ہیلپ لائن", "ٻارن جي مدد لائن"),
    phone: "1098",
  },
  {
    label: lt("Medical / Ambulance", "चिकित्सा / एम्बुलेंस", "వైద్య / అంబులెన్స్", "તબીબી / એમ્બ્યુલન્સ", "طبی / ایمبولینس", "طبي / ايمبيولنس"),
    phone: "108",
  },
  {
    label: lt("Fire Service", "अग्निशमन सेवा", "అగ్నిమాపక సేవ", "ફાયર સર્વિસ", "فائر سروس", "فائر سروس"),
    phone: "101",
  },
  {
    label: lt("Police", "पुलिस", "పోలీసు", "પોલીસ", "پولیس", "پوليس"),
    phone: "100",
  },
  {
    label: lt("Cyber Crime Helpline", "साइबर अपराध हेल्पलाइन", "సైబర్ నేరాల హెల్ప్‌లైన్", "સાયબર ક્રાઇમ હેલ્પલાઇન", "سائبر کرائم ہیلپ لائن", "سائبر ڪرائيم مدد لائين"),
    phone: "1930",
  },
  {
    label: lt("Disaster Management", "आपदा प्रबंधन", "విపత్తు నిర్వహణ", "આપત્તિ વ્યવસ્થાપન", "آفات کا انتظام", "آفت مينيجمينٽ"),
    phone: "1079",
  },
  {
    label: lt("Railway Helpline", "रेलवे हेल्पलाइन", "రైల్వే హెల్ప్‌లైన్", "રેલ્વે હેલ્પલાઇન", "ریلوے ہیلپ لائن", "ريلوي مدد لائين"),
    phone: "139",
  },
];

const GRIEVANCE_KICKER = lt(
  "Not an Emergency?",
  "आपात स्थिति नहीं?",
  "అత్యవసర పరిస్థితి కాదా?",
  "કટોકટી નથી?",
  "ایمرجنسی نہیں؟",
  "ايمرجنسي ناهي؟",
);
const GRIEVANCE_HEADING = lt(
  "Feedback, Grievances & Press",
  "फीडबैक, शिकायतें एवं प्रेस",
  "అభిప్రాయం, ఫిర్యాదులు & ప్రెస్",
  "પ્રતિસાદ, ફરિયાદો અને પ્રેસ",
  "رائے، شکایات اور پریس",
  "راءِ، شڪايتون ۽ پريس",
);
const GRIEVANCE_TITLE = lt(
  "Service Grievances",
  "सेवा शिकायतें",
  "సేవా ఫిర్యాదులు",
  "સેવા ફરિયાદો",
  "سروس شکایات",
  "خدمت شڪايتون",
);
const GRIEVANCE_BODY = lt(
  "Unhappy with a response you received? This is separate from reporting a new emergency — write to us and we'll follow up.",
  "मिली प्रतिक्रिया से असंतुष्ट हैं? यह नई आपात स्थिति की सूचना देने से अलग है — हमें लिखें एवं हम अनुवर्ती कार्रवाई करेंगे।",
  "మీరు పొందిన ప్రతిస్పందనతో అసంతృప్తిగా ఉన్నారా? ఇది కొత్త అత్యవసర పరిస్థితిని నివేదించడం నుండి వేరు — మాకు వ్రాయండి మరియు మేము ఫాలో అప్ చేస్తాము.",
  "તમને મળેલા પ્રતિભાવથી નાખુશ છો? આ નવી કટોકટીની જાણ કરવાથી અલગ છે — અમને લખો અને અમે અનુસરણ કરીશું.",
  "موصول ہونے والے ردعمل سے ناخوش ہیں؟ یہ نئی ایمرجنسی کی اطلاع دینے سے الگ ہے — ہمیں لکھیں اور ہم پیروی کریں گے۔",
  "مليل ردعمل کان ناخوش آهيو؟ هي نئين ايمرجنسي جي اطلاع ڏيڻ کان الڳ آهي — اسان کي لکو ۽ اسين پيروي ڪنداسين.",
);
const GRIEVANCE_CTA = lt("Raise a Grievance", "शिकायत दर्ज करें", "ఫిర్యాదు నమోదు చేయండి", "ફરિયાદ નોંધાવો", "شکایت درج کریں", "شڪايت داخل ڪريو");

const RTI_TITLE = lt(
  "Right to Information (RTI)",
  "सूचना का अधिकार (आरटीआई)",
  "సమాచార హక్కు (RTI)",
  "માહિતીનો અધિકાર (RTI)",
  "حق اطلاعات (RTI)",
  "معلومات جو حق (RTI)",
);
const RTI_BODY = lt(
  "RTI applications can be submitted through the Government of Telangana's RTI process or in writing to our Hyderabad headquarters.",
  "आरटीआई आवेदन तेलंगाना सरकार की आरटीआई प्रक्रिया के माध्यम से या हमारे हैदराबाद मुख्यालय को लिखित रूप में जमा किए जा सकते हैं।",
  "RTI దరఖాస్తులను తెలంగాణ ప్రభుత్వ RTI ప్రక్రియ ద్వారా లేదా మా హైదరాబాద్ ప్రధాన కార్యాలయానికి వ్రాతపూర్వకంగా సమర్పించవచ్చు.",
  "RTI અરજીઓ તેલંગાણા સરકારની RTI પ્રક્રિયા દ્વારા અથવા અમારા હૈદરાબાદ મુખ્યાલયને લેખિતમાં સુપરત કરી શકાય છે.",
  "RTI درخواستیں حکومت تلنگانہ کے RTI عمل کے ذریعے یا ہمارے حیدرآباد ہیڈکوارٹرز کو تحریری طور پر جمع کرائی جا سکتی ہیں۔",
  "RTI درخواستون تلنگانا حڪومت جي RTI عمل ذريعي يا اسان جي حيدرآباد هيڊڪوارٽرز ڏانهن لکت ۾ جمع ڪرائي سگهجن ٿيون.",
);

const PRESS_TITLE = lt("Press & Media", "प्रेस एवं मीडिया", "ప్రెస్ & మీడియా", "પ્રેસ અને મીડિયા", "پریس اور میڈیا", "پريس ۽ ميڊيا");
const PRESS_BODY = lt(
  "For approved facts, official photographs, and Department logos, media representatives can reach our press desk by email.",
  "स्वीकृत तथ्यों, आधिकारिक तस्वीरों एवं विभागीय लोगो के लिए, मीडिया प्रतिनिधि हमारे प्रेस डेस्क से ईमेल द्वारा संपर्क कर सकते हैं।",
  "ఆమోదించబడిన వాస్తవాలు, అధికారిక ఫోటోగ్రాఫ్‌లు మరియు డిపార్ట్‌మెంట్ లోగోల కోసం, మీడియా ప్రతినిధులు మా ప్రెస్ డెస్క్‌ను ఇమెయిల్ ద్వారా సంప్రదించవచ్చు.",
  "મંજૂર કરેલી હકીકતો, સત્તાવાર ફોટોગ્રાફ્સ અને વિભાગના લોગો માટે, મીડિયા પ્રતિનિધિઓ અમારા પ્રેસ ડેસ્કનો ઇમેઇલ દ્વારા સંપર્ક કરી શકે છે.",
  "منظور شدہ حقائق، سرکاری تصاویر اور محکمے کے لوگو کے لیے، میڈیا نمائندے ہمارے پریس ڈیسک سے ای میل کے ذریعے رابطہ کر سکتے ہیں۔",
  "منظور ٿيل حقيقتون، سرڪاري تصويرون ۽ کاتي جي لوگو لاءِ، ميڊيا نمائندا اسان جي پريس ڊيسڪ سان اي ميل ذريعي رابطو ڪري سگهن ٿا.",
);

const CTA_KICKER = lt("Need Immediate Help?", "तुरंत मदद चाहिए?", "వెంటనే సహాయం కావాలా?", "તાત્કાલિક મદદ જોઈએ છે?", "فوری مدد چاہیے؟", "فوري مدد گھرجي؟");
const CTA_HEADING = lt(
  "Need Immediate Assistance?",
  "तत्काल सहायता चाहिए?",
  "తక్షణ సహాయం కావాలా?",
  "તાત્કાલિક સહાય જોઈએ છે?",
  "فوری معاونت درکار ہے؟",
  "فوري مدد گھرجي؟",
);
const CTA_SUBTITLE = lt(
  "Our services are available 24/7 across Telangana. Dial 112 for emergencies or contact us via email, social media, or our mobile apps.",
  "हमारी सेवाएं तेलंगाना भर में 24/7 उपलब्ध हैं। आपातकाल के लिए 112 डायल करें या ईमेल, सोशल मीडिया या हमारे मोबाइल ऐप्स के माध्यम से हमसे संपर्क करें।",
  "మా సేవలు తెలంగాణ అంతటా 24/7 అందుబాటులో ఉన్నాయి. అత్యవసర పరిస్థితుల్లో 112కు డయల్ చేయండి లేదా ఇమెయిల్, సోషల్ మీడియా లేదా మా మొబైల్ యాప్‌ల ద్వారా మమ్మల్ని సంప్రదించండి.",
  "અમારી સેવાઓ તેલંગાણામાં 24/7 ઉપલબ્ધ છે. કટોકટી માટે 112 ડાયલ કરો અથવા ઈમેલ, સોશિયલ મીડિયા અથવા અમારી મોબાઇલ એપ્સ દ્વારા અમારો સંપર્ક કરો.",
  "ہماری خدمات تلنگانہ بھر میں 24/7 دستیاب ہیں۔ ایمرجنسی کے لیے 112 ڈائل کریں یا ای میل، سوشل میڈیا یا ہماری موبائل ایپس کے ذریعے ہم سے رابطہ کریں۔",
  "اسان جون خدمتون تلنگانا ۾ 24/7 موجود آهن. ايمرجنسي لاءِ 112 ڊائل ڪريو يا اي ميل، سوشل ميڊيا يا اسان جي موبائل ائپس ذريعي اسان سان رابطو ڪريو.",
);

type ChannelRow = { icon: IconType; label: string; href?: string };

function QuickContactCard({
  icon: Icon,
  ring,
  label,
  value,
  caption,
  href,
}: {
  icon: IconType;
  ring: string;
  label: string;
  value: string;
  caption: string;
  href: string;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="block h-full perspective-[1600px]"
    >
      <motion.div
        className="relative h-full w-full transform-3d"
        initial={{ rotateY: 0 }}
        whileInView={{ rotateY: 180 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.15 }}
      >
        {/* Content face — revealed on scroll. h-full so every card in the row matches the grid's stretched row height. */}
        <div className="relative flex h-full min-h-48 flex-col items-center justify-center rounded-2xl bg-navy-50 p-6 text-center backface-hidden rotate-y-180 dark:bg-navy-900/40">
          <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${ring}`}>
            <Icon size={18} />
          </span>
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-navy-400 uppercase">{label}</p>
          <p className="mt-1 font-display text-lg font-bold break-all text-navy-900 dark:text-navy-50">{value}</p>
          <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{caption}</p>
        </div>

        {/* Logo face — default; absolute to match the content face's height. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-navy-50 p-6 text-center backface-hidden dark:bg-navy-900/40">
          <img src={telanganaPoliceLogo} alt="" className="h-10 w-auto" />
          <p className="text-xs font-semibold text-navy-500 dark:text-navy-400">{label}</p>
        </div>
      </motion.div>
    </motion.a>
  );
}

function ChannelCard({
  icon: Icon,
  accent,
  iconBg,
  title,
  rows,
}: {
  icon: IconType;
  accent: string;
  iconBg: string;
  title: string;
  rows: ChannelRow[];
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full perspective-[1600px]"
    >
      <motion.div
        className="relative h-full w-full transform-3d"
        initial={{ rotateY: 0 }}
        whileInView={{ rotateY: 180 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.15 }}
      >
        {/* Content face — revealed on scroll. h-full so every card in the row matches the grid's stretched row height. */}
        <div
          className={`relative h-full min-h-80 rounded-2xl border-t-4 bg-white p-6 shadow-sm backface-hidden rotate-y-180 dark:bg-navy-800 ${accent}`}
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon size={18} />
          </span>
          <h3 className="mt-4 font-display font-semibold text-navy-900 dark:text-navy-50">{title}</h3>
          <div className="mt-3 space-y-3 border-t border-navy-100 pt-3 dark:border-navy-700">
            {rows.map((row) =>
              row.href ? (
                <a
                  key={row.label}
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel={row.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group/row flex items-center gap-2.5 text-sm text-navy-600 transition-colors duration-200 hover:text-brand-600 dark:text-navy-300 dark:hover:text-brand-400"
                >
                  <row.icon
                    size={13}
                    className="flex-none text-navy-400 transition-colors duration-200 group-hover/row:text-brand-600 dark:group-hover/row:text-brand-400"
                  />
                  {row.label}
                </a>
              ) : (
                <p key={row.label} className="flex items-start gap-2.5 text-sm text-navy-600 dark:text-navy-300">
                  <row.icon size={13} className="mt-0.5 flex-none text-navy-400" />
                  {row.label}
                </p>
              ),
            )}
          </div>
        </div>

        {/* Logo face — shown by default; absolutely positioned to match the content face's height. */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-t-4 bg-white p-6 text-center shadow-sm backface-hidden dark:bg-navy-800 ${accent}`}
        >
          <img src={telanganaPoliceLogo} alt="" className="h-16 w-auto" />
          <h3 className="font-display font-semibold text-navy-900 dark:text-navy-50">{title}</h3>
          <p className="text-xs text-navy-400">Telangana Police Dial 112</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Contact() {
  const t = useT();

  const facebookHref = socialLinks.find((s) => s.icon === "facebook")?.href ?? "#";
  const twitterHref = socialLinks.find((s) => s.icon === "twitter")?.href ?? "#";

  const quickCards = [
    {
      icon: FaShieldHalved,
      ring: "bg-emergency-500",
      label: t(QUICK_EMERGENCY_LABEL),
      value: EMERGENCY_NUMBER,
      caption: t(QUICK_EMERGENCY_CAPTION),
      href: `tel:${EMERGENCY_NUMBER}`,
    },
    {
      icon: FaPhone,
      ring: "bg-brand-600",
      label: t(QUICK_HELPLINE_LABEL),
      value: contactInfo.helplinePhone,
      caption: t(QUICK_HELPLINE_CAPTION),
      href: `tel:${contactInfo.helplinePhone}`,
    },
    {
      icon: FaLaptop,
      ring: "bg-success-500",
      label: t(QUICK_CYBERCRIME_LABEL),
      value: "1930",
      caption: t(QUICK_CYBERCRIME_CAPTION),
      href: "tel:1930",
    },
    {
      icon: FaFireExtinguisher,
      ring: "bg-accent-500",
      label: t(QUICK_FIRE_LABEL),
      value: contactInfo.firePhone,
      caption: t(QUICK_FIRE_CAPTION),
      href: `tel:${contactInfo.firePhone}`,
    },
    {
      icon: FaChildReaching,
      ring: "bg-navy-600",
      label: t(QUICK_CHILD_LABEL),
      value: "1098",
      caption: t(QUICK_CHILD_CAPTION),
      href: "tel:1098",
    },
    {
      icon: FaTruckMedical,
      ring: "bg-navy-600",
      label: t(QUICK_MEDICAL_LABEL),
      value: "108",
      caption: t(QUICK_MEDICAL_CAPTION),
      href: "tel:108",
    },
  ];

  const channelCards: { icon: IconType; accent: string; iconBg: string; title: string; rows: ChannelRow[] }[] = [
    {
      icon: FaLocationDot,
      accent: "border-t-brand-600",
      iconBg: "bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400",
      title: t(FROM_TELANGANA_TITLE),
      rows: [
        { icon: FaPhone, label: `${EMERGENCY_NUMBER}${t(EMERGENCY_SUFFIX_SHORT)}`, href: `tel:${EMERGENCY_NUMBER}` },
        { icon: FaEnvelope, label: contactInfo.email, href: `mailto:${contactInfo.email}` },
        { icon: FaFacebook, label: t(FACEBOOK_PAGE_LABEL), href: facebookHref },
        { icon: FaXTwitter, label: t(TWITTER_PAGE_LABEL), href: twitterHref },
      ],
    },
    {
      icon: FaGlobe,
      accent: "border-t-accent-500",
      iconBg: "bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400",
      title: t(FROM_OUTSIDE_TELANGANA_TITLE),
      rows: [
        { icon: FaPhone, label: "040-112", href: "tel:040112" },
        { icon: FaEnvelope, label: contactInfo.email, href: `mailto:${contactInfo.email}` },
        { icon: FaFacebook, label: t(FACEBOOK_PAGE_LABEL), href: facebookHref },
        { icon: FaXTwitter, label: t(TWITTER_PAGE_LABEL), href: twitterHref },
      ],
    },
    {
      icon: FaShieldHalved,
      accent: "border-t-emergency-500",
      iconBg: "bg-emergency-50 text-emergency-600 dark:bg-emergency-900/30 dark:text-emergency-400",
      title: t(COMMAND_CENTRE_TITLE),
      rows: [
        { icon: FaLocationDot, label: t(contactInfo.commandCenter) },
        { icon: FaPhone, label: `${EMERGENCY_NUMBER}${t(EMERGENCY_SUFFIX_SHORT)}`, href: `tel:${EMERGENCY_NUMBER}` },
        { icon: FaEnvelope, label: contactInfo.email, href: `mailto:${contactInfo.email}` },
        { icon: FaGlobe, label: "dial100.tspolice.gov.in", href: "https://dial100.tspolice.gov.in" },
        { icon: FaClock, label: t(contactInfo.availability) },
      ],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-30">
        <img src={contactHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/80 to-navy-950/60" />
        <motion.div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection>
            <span className="inline-flex items-center gap-2 text-white dark:text-accent-400 rounded-full border border-accent-400/40 bg-navy-950/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-300 uppercase backdrop-blur">
              <FaHeadset size={12} /> {t(HERO_KICKER)}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">
              {t(HERO_TITLE_PREFIX)} <span className="text-accent-400">{t(HERO_TITLE_HIGHLIGHT)}</span> {t(HERO_TITLE_SUFFIX)}
            </h1>
            <p className="mt-4 text-lg text-navy-300">{t(HERO_SUBTITLE)}</p>
            <div className="mt-8 flex justify-center">
              <EmergencyButton size="lg" />
            </div>
          </MotionSection>
        </div>
        <div className="absolute inset-x-0 -bottom-1 h-10 rounded-t-[2.5rem] bg-white sm:h-14 dark:bg-navy-950" />
      </section>

      {/* Quick contact cards */}
      <section className="mx-auto  max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          {quickCards.map((c) => (
            <QuickContactCard key={c.label} {...c} />
          ))}
        </StaggerGroup>
      </section>

      {/* Ways to reach us */}
      <section className="bg-navy-50 py-20 dark:bg-navy-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-3 text-xs font-semibold tracking-widest text-accent-500 uppercase">
              <span className="h-px w-8 bg-accent-500/40" /> {t(CHANNELS_KICKER)} <span className="h-px w-8 bg-accent-500/40" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 dark:text-navy-50 sm:text-4xl">{t(CHANNELS_HEADING)}</h2>
            <p className="mt-3 text-navy-500 dark:text-navy-400">{t(CHANNELS_SUBTITLE)}</p>
          </MotionSection>

          <StaggerGroup className="mt-12 grid gap-6 lg:grid-cols-3">
            {channelCards.map((card) => (
              <ChannelCard key={card.title} {...card} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Other emergency helplines — Women, Child, Medical, Fire, etc. */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-widest text-accent-500 uppercase">{t(OTHER_HELPLINES_KICKER)}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 dark:text-navy-50 sm:text-4xl">{t(OTHER_HELPLINES_HEADING)}</h2>
          </MotionSection>

          <StaggerGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {otherHelplines.map((h) => (
              <motion.a
                key={h.phone}
                href={`tel:${h.phone}`}
                variants={staggerItem}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm shadow-sm transition-colors hover:border-brand-400 dark:border-navy-700 dark:bg-navy-800"
              >
                <span className="font-medium text-navy-700 dark:text-navy-200">{t(h.label)}</span>
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{h.phone}</span>
              </motion.a>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Feedback, grievance & press — deliberately separate from emergency intake */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-widest text-accent-500 uppercase">{t(GRIEVANCE_KICKER)}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 dark:text-navy-50 sm:text-4xl">{t(GRIEVANCE_HEADING)}</h2>
          </MotionSection>

          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-3">
            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                <FaCommentDots size={18} />
              </span>
              <h3 className="mt-4 font-display font-semibold text-navy-900 dark:text-navy-50">{t(GRIEVANCE_TITLE)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500 dark:text-navy-400">{t(GRIEVANCE_BODY)}</p>
              <a
                href={`mailto:${contactInfo.email}?subject=Service%20Grievance`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {t(GRIEVANCE_CTA)}
              </a>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <FaScaleBalanced size={18} />
              </span>
              <h3 className="mt-4 font-display font-semibold text-navy-900 dark:text-navy-50">{t(RTI_TITLE)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500 dark:text-navy-400">{t(RTI_BODY)}</p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-navy-700 dark:text-navy-300">
                <FaNewspaper size={18} />
              </span>
              <h3 className="mt-4 font-display font-semibold text-navy-900 dark:text-navy-50">{t(PRESS_TITLE)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500 dark:text-navy-400">{t(PRESS_BODY)}</p>
              <a
                href={`mailto:${contactInfo.email}?subject=Press%20Inquiry`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {t(QUICK_EMAIL_LABEL)}
              </a>
            </motion.div>
          </StaggerGroup>
        </div>
      </section>

      {/* Bottom CTA */}
      <MotionSection className="bg-navy-900 py-20 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest text-accent-400 uppercase">{t(CTA_KICKER)}</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{t(CTA_HEADING)}</h2>
          <p className="mt-4 text-navy-300">{t(CTA_SUBTITLE)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <EmergencyButton size="lg" />
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
