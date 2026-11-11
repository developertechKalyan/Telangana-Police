import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FaLocationCrosshairs, FaMapPin, FaLocationDot, FaSatelliteDish, FaRoad } from "react-icons/fa6";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { EmergencyButton } from "@/components/EmergencyButton";
import { useT } from "@/contexts/LanguageContext";
import type { LocalizedText } from "@/i18n/locales";
import { ui } from "@/i18n/ui";
import heroImg from "@/assets/gallery/gallery5.jpeg";

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

const HERO_TITLE = lt(
  "Help Us Find You",
  "हमें आपको ढूंढने में मदद करें",
  "మిమ్మల్ని కనుగొనడంలో మాకు సహాయం చేయండి",
  "અમને તમને શોધવામાં મદદ કરો",
  "ہمیں آپ کو تلاش کرنے میں مدد کریں",
  "اسان کي توهان کي ڳولڻ ۾ مدد ڪريو",
);

const CTA_TITLE = lt(
  "In an emergency, don't wait to find the perfect words",
  "आपात स्थिति में, सही शब्द खोजने के लिए प्रतीक्षा न करें",
  "అత్యవసర పరిస్థితిలో, సరైన పదాల కోసం వేచి ఉండకండి",
  "કટોકટીમાં, યોગ્ય શબ્દો શોધવાની રાહ ન જુઓ",
  "ایمرجنسی میں، صحیح الفاظ ڈھونڈنے کا انتظار نہ کریں",
  "ايمرجنسي ۾، صحيح لفظ ڳولڻ جو انتظار نه ڪريو",
);

const CTA_BODY = lt(
  "Call 112 first — our officers will help you describe where you are, step by step.",
  "पहले 112 पर कॉल करें — हमारे अधिकारी आपको यह बताने में मदद करेंगे कि आप कहां हैं, चरण दर चरण।",
  "మొదట 112కు కాల్ చేయండి — మీరు ఎక్కడ ఉన్నారో దశలవారీగా వివరించడంలో మా అధికారులు మీకు సహాయం చేస్తారు.",
  "પહેલા 112 પર કૉલ કરો — અમારા અધિકારીઓ તમને પગલા-દર-પગલા તમે ક્યાં છો તે વર્ણવવામાં મદદ કરશે.",
  "پہلے 112 پر کال کریں — ہمارے افسران مرحلہ وار آپ کی مدد کریں گے کہ آپ کہاں ہیں بتانے میں۔",
  "پهرين 112 تي ڪال ڪريو — اسان جا آفيسر مرحلي در مرحلي توهان جي مدد ڪندا ته توهان ڪٿي آهيو ٻڌائڻ ۾.",
);

const HERO_SUBTITLE = lt(
  "The faster we know where you are, the faster help arrives. A few simple habits make all the difference.",
  "जितनी तेज़ी से हमें पता चलेगा कि आप कहां हैं, उतनी ही तेज़ी से मदद पहुंचेगी। कुछ सरल आदतें बड़ा फर्क डालती हैं।",
  "మీరు ఎక్కడ ఉన్నారో మాకు ఎంత వేగంగా తెలిస్తే, సహాయం అంత వేగంగా చేరుకుంటుంది. కొన్ని సాధారణ అలవాట్లు పెద్ద తేడాను కలిగిస్తాయి.",
  "અમને જેટલી ઝડપથી ખબર પડે કે તમે ક્યાં છો, એટલી ઝડપથી મદદ પહોંચે છે. થોડી સરળ ટેવો મોટો ફરક પાડે છે.",
  "ہمیں جتنی جلدی معلوم ہو کہ آپ کہاں ہیں، اتنی ہی جلدی مدد پہنچتی ہے۔ چند آسان عادات بڑا فرق ڈالتی ہیں۔",
  "اسان کي جيترو جلدي خبر پوي ته توهان ڪٿي آهيو، اوترو جلدي مدد پھچندي. ڪجهه سادا عادتون وڏو فرق وجهن ٿيون.",
);

type Card = { icon: IconType; title: LocalizedText; body: LocalizedText; tips?: LocalizedText[] };

const CARDS: Card[] = [
  {
    icon: FaMapPin,
    title: lt(
      "Describing Your Location Without an Address",
      "बिना पते के अपना स्थान बताना",
      "చిరునామా లేకుండా మీ స్థానాన్ని వివరించడం",
      "સરનામા વગર તમારું સ્થાન વર્ણવવું",
      "پتے کے بغیر اپنا مقام بتانا",
      "پتي کان سواءِ پنهنجي جاءِ ٻڌائڻ",
    ),
    body: lt(
      "You don't need to know a formal address. Officers are trained to work with everyday landmarks — just describe what you see around you.",
      "आपको औपचारिक पता जानने की जरूरत नहीं है। अधिकारी रोजमर्रा के लैंडमार्क के साथ काम करने के लिए प्रशिक्षित हैं — बस बताएं कि आपके आसपास क्या दिख रहा है।",
      "మీకు అధికారిక చిరునామా తెలియాల్సిన అవసరం లేదు. అధికారులు రోజువారీ ల్యాండ్‌మార్క్‌లతో పనిచేయడానికి శిక్షణ పొందారు — మీ చుట్టూ ఏమి కనిపిస్తుందో వివరించండి.",
      "તમારે ઔપચારિક સરનામું જાણવાની જરૂર નથી. અધિકારીઓ રોજિંદા સીમાચિહ્નો સાથે કામ કરવા માટે પ્રશિક્ષિત છે — બસ તમારી આસપાસ શું દેખાય છે તે વર્ણવો.",
      "آپ کو باضابطہ پتہ جاننے کی ضرورت نہیں۔ افسران روزمرہ کی نشانیوں کے ساتھ کام کرنے کی تربیت رکھتے ہیں — بس بتائیں کہ آپ کے ارد گرد کیا نظر آتا ہے۔",
      "توهان کي رسمي پتو ڄاڻڻ جي ضرورت ناهي. آفيسر روزاني نشانين سان ڪم ڪرڻ لاءِ تربيت يافته آهن — بس ٻڌايو ته توهان جي چوڌاري ڇا نظر اچي ٿو.",
    ),
    tips: [
      lt("Nearest main road or crossroad", "निकटतम मुख्य सड़क या चौराहा", "సమీప ప్రధాన రహదారి లేదా కూడలి", "નજીકનો મુખ્ય રસ્તો અથવા ચાર રસ્તા", "قریب ترین اہم سڑک یا چوراہا", "ويجھو مکيه رستو يا چار رستو"),
      lt("A landmark or shop name", "एक लैंडमार्क या दुकान का नाम", "ఒక ల్యాండ్‌మార్క్ లేదా దుకాణం పేరు", "એક સીમાચિહ્ન અથવા દુકાનનું નામ", "کوئی نشانی یا دکان کا نام", "ڪا نشاني يا دڪان جو نالو"),
      lt("A pillar or milestone number", "एक खंभे या मील के पत्थर की संख्या", "ఒక పిల్లర్ లేదా మైలురాయి సంఖ్య", "એક પિલર અથવા માઇલસ્ટોન નંબર", "کوئی کھمبہ یا میل اسٹون نمبر", "ڪو ٿنڀو يا ميل اسٽون نمبر"),
      lt("The nearest bus stop", "निकटतम बस स्टॉप", "సమీప బస్ స్టాప్", "નજીકનું બસ સ્ટોપ", "قریب ترین بس اسٹاپ", "ويجھو بس اسٽاپ"),
    ],
  },
  {
    icon: FaLocationCrosshairs,
    title: lt(
      "Share Your Live Location",
      "अपना लाइव लोकेशन साझा करें",
      "మీ లైవ్ లొకేషన్‌ను పంచుకోండి",
      "તમારું લાઇવ લોકેશન શેર કરો",
      "اپنا لائیو لوکیشن شیئر کریں",
      "پنهنجي لائيو لوڪيشن شيئر ڪريو",
    ),
    body: lt(
      "On WhatsApp, you can share your exact live location in just a few taps — often the fastest way for us to find you.",
      "व्हाट्सएप पर, आप कुछ ही टैप में अपना सटीक लाइव लोकेशन साझा कर सकते हैं — अक्सर हमें ढूंढने का सबसे तेज़ तरीका।",
      "వాట్సాప్‌లో, మీరు కొన్ని ట్యాప్‌లలో మీ ఖచ్చితమైన లైవ్ లొకేషన్‌ను పంచుకోవచ్చు — తరచుగా మమ్మల్ని కనుగొనడానికి వేగవంతమైన మార్గం.",
      "વોટ્સએપ પર, તમે થોડા ટેપમાં તમારું ચોક્કસ લાઇવ લોકેશન શેર કરી શકો છો — ઘણીવાર અમને શોધવાની સૌથી ઝડપી રીત.",
      "واٹس ایپ پر، آپ چند ٹیپس میں اپنا درست لائیو لوکیشن شیئر کر سکتے ہیں — اکثر ہمیں تلاش کرنے کا تیز ترین طریقہ۔",
      "واٽس ائپ تي، توهان ڪجهه ٽئپن ۾ پنهنجي صحيح لائيو لوڪيشن شيئر ڪري سگهو ٿا — اڪثر اسان کي ڳولڻ جو تڪڙو طريقو.",
    ),
    tips: [
      lt("Open the chat with our official WhatsApp number", "हमारे आधिकारिक व्हाट्सएप नंबर के साथ चैट खोलें", "మా అధికారిక వాట్సాప్ నంబర్‌తో చాట్ తెరవండి", "અમારા સત્તાવાર વોટ્સએપ નંબર સાથે ચેટ ખોલો", "ہمارے سرکاری واٹس ایپ نمبر کے ساتھ چیٹ کھولیں", "اسان جي سرڪاري واٽس ائپ نمبر سان چيٽ کوليو"),
      lt("Tap the attachment icon, then choose Location", "अटैचमेंट आइकन पर टैप करें, फिर लोकेशन चुनें", "అటాచ్‌మెంట్ చిహ్నాన్ని నొక్కి, స్థానాన్ని ఎంచుకోండి", "એટેચમેન્ટ આઇકોન પર ટેપ કરો, પછી લોકેશન પસંદ કરો", "اٹیچمنٹ آئیکن پر ٹیپ کریں، پھر لوکیشن منتخب کریں", "اٽيچمينٽ آئڪن تي ٽئپ ڪريو، پوءِ لوڪيشن چونڊيو"),
      lt("Select \"Share Live Location\"", "\"लाइव लोकेशन साझा करें\" चुनें", "\"లైవ్ లొకేషన్ షేర్ చేయి\" ఎంచుకోండి", "\"લાઇવ લોકેશન શેર કરો\" પસંદ કરો", "\"لائیو لوکیشن شیئر کریں\" منتخب کریں", "\"لائيو لوڪيشن شيئر ڪريو\" چونڊيو"),
    ],
  },
  {
    icon: FaLocationDot,
    title: lt("What is DIGIPIN", "डिजिपिन क्या है", "DIGIPIN అంటే ఏమిటి", "DIGIPIN શું છે", "DIGIPIN کیا ہے", "DIGIPIN ڇا آهي"),
    body: lt(
      "DIGIPIN is a digital address for your exact location, expressed as a simple code. Once your family knows your home's DIGIPIN, you can share it instantly during an emergency call or message. Note it down in advance and keep it somewhere handy.",
      "डिजिपिन आपके सटीक स्थान का एक डिजिटल पता है, जिसे एक सरल कोड के रूप में दर्शाया जाता है। एक बार जब आपका परिवार आपके घर का डिजिपिन जान लेता है, तो आप आपात कॉल या संदेश के दौरान इसे तुरंत साझा कर सकते हैं। इसे पहले से नोट कर लें और इसे कहीं आसानी से उपलब्ध रखें।",
      "DIGIPIN అనేది మీ ఖచ్చితమైన స్థానానికి డిజిటల్ చిరునామా, ఒక సాధారణ కోడ్‌గా వ్యక్తీకరించబడుతుంది. మీ కుటుంబానికి మీ ఇంటి DIGIPIN తెలిస్తే, అత్యవసర కాల్ లేదా సందేశం సమయంలో మీరు దానిని వెంటనే పంచుకోవచ్చు. దానిని ముందుగానే గమనించి, అందుబాటులో ఉంచండి.",
      "DIGIPIN એ તમારા ચોક્કસ સ્થાનનું ડિજિટલ સરનામું છે, જે એક સરળ કોડ તરીકે વ્યક્ત થાય છે. એકવાર તમારો પરિવાર તમારા ઘરનો DIGIPIN જાણી લે, પછી તમે કટોકટી કૉલ અથવા સંદેશ દરમિયાન તેને તરત જ શેર કરી શકો છો. તેને અગાઉથી નોંધી લો અને તેને હાથવગું રાખો.",
      "DIGIPIN آپ کے درست مقام کا ڈیجیٹل پتہ ہے، جو ایک آسان کوڈ کے طور پر ظاہر ہوتا ہے۔ ایک بار آپ کا خاندان آپ کے گھر کا DIGIPIN جان لے، تو آپ ایمرجنسی کال یا پیغام کے دوران اسے فوراً شیئر کر سکتے ہیں۔ اسے پہلے سے نوٹ کر لیں اور اسے قریب رکھیں۔",
      "DIGIPIN توهان جي صحيح جاءِ جو ڊجيٽل پتو آهي، جيڪو هڪ سادي ڪوڊ طور ظاهر ٿئي ٿو. هڪ ڀيرو توهان جو خاندان توهان جي گھر جو DIGIPIN ڄاڻي ته، توهان ايمرجنسي ڪال يا پيغام دوران ان کي فوري شيئر ڪري سگهو ٿا. ان کي اڳواٽ نوٽ ڪري ڪٿي هٿ ويجھو رکو.",
    ),
  },
  {
    icon: FaSatelliteDish,
    title: lt(
      "Keep Location Services On",
      "लोकेशन सेवाएं चालू रखें",
      "లొకేషన్ సేవలను ఆన్‌లో ఉంచండి",
      "લોકેશન સેવાઓ ચાલુ રાખો",
      "لوکیشن سروسز آن رکھیں",
      "لوڪيشن سروسز آن رکو",
    ),
    body: lt(
      "The system uses multiple methods to identify where you are calling from. Keeping location services switched on during an emergency call helps us confirm your position faster.",
      "सिस्टम यह पहचानने के लिए कई तरीकों का उपयोग करता है कि आप कहां से कॉल कर रहे हैं। आपातकालीन कॉल के दौरान लोकेशन सेवाओं को चालू रखने से हमें आपकी स्थिति तेजी से पुष्टि करने में मदद मिलती है।",
      "మీరు ఎక్కడి నుండి కాల్ చేస్తున్నారో గుర్తించడానికి సిస్టమ్ బహుళ పద్ధతులను ఉపయోగిస్తుంది. అత్యవసర కాల్ సమయంలో లొకేషన్ సేవలను ఆన్‌లో ఉంచడం మీ స్థానాన్ని వేగంగా నిర్ధారించడంలో సహాయపడుతుంది.",
      "તમે ક્યાંથી કૉલ કરી રહ્યા છો તે ઓળખવા માટે સિસ્ટમ બહુવિધ પદ્ધતિઓનો ઉપયોગ કરે છે. કટોકટી કૉલ દરમિયાન લોકેશન સેવાઓ ચાલુ રાખવાથી અમને તમારું સ્થાન ઝડપથી પુષ્ટિ કરવામાં મદદ મળે છે.",
      "نظام متعدد طریقوں کا استعمال کرتے ہوئے شناخت کرتا ہے کہ آپ کہاں سے کال کر رہے ہیں۔ ایمرجنسی کال کے دوران لوکیشن سروسز آن رکھنے سے ہمیں آپ کی پوزیشن تیزی سے تصدیق کرنے میں مدد ملتی ہے۔",
      "سسٽم ڪيترائي طريقا استعمال ڪري ٿو اهو سڃاڻڻ لاءِ ته توهان ڪٿان ڪال ڪري رهيا آهيو. ايمرجنسي ڪال دوران لوڪيشن سروسز آن رکڻ سان اسان کي توهان جي پوزيشن تڪڙو تصديق ڪرڻ ۾ مدد ملي ٿي.",
    ),
  },
  {
    icon: FaRoad,
    title: lt(
      "Highways, Rural Areas & Apartments",
      "राजमार्ग, ग्रामीण क्षेत्र एवं अपार्टमेंट",
      "రహదారులు, గ్రామీణ ప్రాంతాలు & అపార్ట్‌మెంట్‌లు",
      "હાઇવે, ગ્રામીણ વિસ્તારો અને એપાર્ટમેન્ટ્સ",
      "ہائی ویز، دیہی علاقے اور اپارٹمنٹس",
      "هاءِ وي، ٻهراڙيءَ وارا علائقا ۽ اپارٽمينٽس",
    ),
    body: lt(
      "A little extra detail goes a long way in these settings.",
      "इन स्थितियों में थोड़ा अतिरिक्त विवरण बहुत मदद करता है।",
      "ఈ సందర్భాలలో కొంచెం అదనపు వివరాలు చాలా సహాయపడతాయి.",
      "આ સ્થિતિઓમાં થોડી વધારાની વિગત ઘણી મદદ કરે છે.",
      "ان حالات میں تھوڑی اضافی تفصیل بہت مدد کرتی ہے۔",
      "انهن حالتن ۾ ٿورو وڌيڪ تفصيل تمام مدد ڪري ٿو.",
    ),
    tips: [
      lt(
        "Highways: nearest kilometre stone, toll plaza, or direction of travel",
        "राजमार्ग: निकटतम किलोमीटर पत्थर, टोल प्लाजा, या यात्रा की दिशा",
        "రహదారులు: సమీప కిలోమీటర్ రాయి, టోల్ ప్లాజా, లేదా ప్రయాణ దిశ",
        "હાઇવે: નજીકનો કિલોમીટર પથ્થર, ટોલ પ્લાઝા, અથવા મુસાફરીની દિશા",
        "ہائی ویز: قریب ترین کلومیٹر پتھر، ٹول پلازہ، یا سفر کی سمت",
        "هاءِ وي: ويجھو ڪلوميٽر پٿر، ٽول پلازا، يا سفر جي طرف",
      ),
      lt(
        "Rural areas: village name plus a nearby temple, school or landmark",
        "ग्रामीण क्षेत्र: गांव का नाम और नजदीकी मंदिर, स्कूल या लैंडमार्क",
        "గ్రామీణ ప్రాంతాలు: గ్రామం పేరు మరియు సమీప దేవాలయం, పాఠశాల లేదా ల్యాండ్‌మార్క్",
        "ગ્રામીણ વિસ્તારો: ગામનું નામ અને નજીકનું મંદિર, શાળા અથવા સીમાચિહ્ન",
        "دیہی علاقے: گاؤں کا نام اور قریبی مندر، اسکول یا نشانی",
        "ٻهراڙيءَ وارا علائقا: ڳوٺ جو نالو ۽ ويجھو مندر، اسڪول يا نشاني",
      ),
      lt(
        "Apartments: building name, block or tower, floor and flat number, and the main gate or security desk",
        "अपार्टमेंट: इमारत का नाम, ब्लॉक या टावर, मंजिल एवं फ्लैट नंबर, और मुख्य गेट या सुरक्षा डेस्क",
        "అపార్ట్‌మెంట్‌లు: భవనం పేరు, బ్లాక్ లేదా టవర్, అంతస్తు మరియు ఫ్లాట్ నంబర్, మరియు ప్రధాన గేటు లేదా భద్రతా డెస్క్",
        "એપાર્ટમેન્ટ્સ: ઇમારતનું નામ, બ્લોક અથવા ટાવર, માળ અને ફ્લેટ નંબર, અને મુખ્ય ગેટ અથવા સુરક્ષા ડેસ્ક",
        "اپارٹمنٹس: عمارت کا نام، بلاک یا ٹاور، منزل اور فلیٹ نمبر، اور مرکزی گیٹ یا سیکیورٹی ڈیسک",
        "اپارٽمينٽس: عمارت جو نالو، بلاڪ يا ٽاور، منزل ۽ فليٽ نمبر، ۽ مکيه گيٽ يا سيڪيورٽي ڊيسڪ",
      ),
    ],
  },
];

export function FindYou() {
  const t = useT();

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/80 to-navy-950/60" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <MotionSection>
            <span className="inline-flex items-center gap-2 text-accent-400 dark:text-white rounded-full border border-accent-400/40 bg-navy-950/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-300 uppercase backdrop-blur">
              <FaLocationCrosshairs size={12} /> {t(ui.nav.getHelp)}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">{t(HERO_TITLE)}</h1>
            <p className="mt-4 text-lg text-navy-300">{t(HERO_SUBTITLE)}</p>
          </MotionSection>
        </div>
        <div className="absolute inset-x-0 -bottom-1 h-10 rounded-t-[2.5rem] bg-white sm:h-14 dark:bg-navy-950" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <StaggerGroup className="grid gap-6 sm:grid-cols-2">
          {CARDS.map((card) => (
            <motion.div
              key={card.title.en}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-400 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <card.icon size={19} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-900 dark:text-navy-50">{t(card.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500 dark:text-navy-400">{t(card.body)}</p>
              {card.tips && (
                <ul className="mt-4 space-y-1.5">
                  {card.tips.map((tip) => (
                    <li key={tip.en} className="flex items-start gap-2 text-sm text-navy-600 dark:text-navy-300">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-brand-500" />
                      {t(tip)}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </StaggerGroup>
      </section>

      <section className="bg-navy-50 py-16 text-center dark:bg-navy-900/40">
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{t(CTA_TITLE)}</h2>
        <p className="mx-auto mt-2 max-w-xl text-navy-500 dark:text-navy-400">{t(CTA_BODY)}</p>
        <div className="mt-6 flex justify-center">
          <EmergencyButton size="lg" />
        </div>
      </section>
    </div>
  );
}
