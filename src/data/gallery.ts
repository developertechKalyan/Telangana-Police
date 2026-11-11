import type { GalleryItem } from "@/types/content";
import type { LocalizedText } from "@/i18n/locales";

import gallery1 from "@/assets/gallery/gallery1.jpeg";
import gallery2 from "@/assets/gallery/gallery2.jpg";
import gallery3 from "@/assets/gallery/gallery3.jpeg";
import gallery4 from "@/assets/gallery/gallery4.jpeg";
import gallery5 from "@/assets/gallery/gallery5.jpeg";
import gallery6 from "@/assets/gallery/gallery6.jpeg";
import gallery7 from "@/assets/gallery/gallery7.jpeg";
import gallery8 from "@/assets/gallery/gallery8.jpeg";
import gallery9 from "@/assets/gallery/gallery9.jpeg";
import gallery10 from "@/assets/gallery/gallery10.jpeg";
import gallery11 from "@/assets/gallery/gallery11.jpeg";
import gallery12 from "@/assets/gallery/gallery12.jpeg";
import gallery13 from "@/assets/gallery/gallery13.jpeg";
import gallery14 from "@/assets/gallery/gallery14.jpeg";
import gallery15 from "@/assets/gallery/gallery15.jpeg";
import gallery16 from "@/assets/gallery/gallery16.jpeg";
import gallery17 from "@/assets/gallery/gallery17.jpeg";
import gallery18 from "@/assets/gallery/gallery18.jpeg";
import gallery19 from "@/assets/gallery/gallery19.jpeg";
import gallery20 from "@/assets/gallery/gallery20.jpeg";

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

export const galleryItems: GalleryItem[] = [

  {
    id: 4,
    type: "video",
    src: "https://www.youtube.com/watch?v=Jbaq6s7_ODA",
    caption: lt(
      "Dial 112 program highlights",
      "डायल 112 कार्यक्रम की झलकियां",
      "డయల్ 112 కార్యక్రమ ముఖ్యాంశాలు",
      "ડાયલ 112 કાર્યક્રમની ઝલક",
      "ڈائل 112 پروگرام کی جھلکیاں",
      "ڊائل 112 پروگرام جون جهلڪيون",
    ),
  },
  {
  id: 21,
  type: "video",
  src: "https://www.youtube.com/watch?v=_7HbFrWanrk",
  caption: lt(
    "Police awareness campaign",
    "पुलिस जागरूकता अभियान",
    "పోలీస్ అవగాహన కార్యక్రమం",
    "પોલીસ જાગૃતિ અભિયાન",
    "پولیس آگاہی مہم",
    "پوليس آگاهي مهم",
  ),
},
{
  id: 22,
  type: "video",
  src: "https://youtu.be/Y8_AysdpxSQ?si=FDTL4omz8FdyTRa2",
  caption: lt(
    "Community policing initiative",
    "सामुदायिक पुलिसिंग पहल",
    "కమ్యూనిటీ పోలీసింగ్ కార్యక్రమం",
    "સમુદાય પોલીસિંગ પહેલ",
    "کمیونٹی پولیسنگ اقدام",
    "ڪميونٽي پوليسنگ شروعات",
  ),
},
{
  id: 23,
  type: "video",
  src: "https://www.youtube.com/watch?v=plgV1IrA35k",
  caption: lt(
    "Public safety awareness video",
    "जन सुरक्षा जागरूकता वीडियो",
    "ప్రజా భద్రత అవగాహన వీడియో",
    "જાહેર સુરક્ષા જાગૃતિ વિડિયો",
    "عوامی تحفظ آگاہی ویڈیو",
    "عوامي تحفظ آگاهي وڊيو",
  ),
},
{
  id: 24,
  type: "photo",
  src: gallery1,
  caption: lt(
    "Women police contingent marches in parade",
    "महिला पुलिस दल परेड में मार्च करता हुआ",
    "మహిళా పోలీసు దళం పరేడ్‌లో మార్చింగ్",
    "મહિલા પોલીસ ટુકડી પરેડમાં કૂચ કરતી",
    "خواتین پولیس دستے کی پریڈ میں مارچ",
    "عورتين پوليس دستي جي پريڊ ۾ مارچ",
  ),
},
{
  id: 25,
  type: "photo",
  src: gallery2,
  caption: lt(
    "Women officers march in ceremonial parade",
    "महिला अधिकारी औपचारिक परेड में मार्च करते हुए",
    "మహిళా అధికారులు వేడుక పరేడ్‌లో మార్చింగ్",
    "મહિલા અધિકારીઓ ઔપચારિક પરેડમાં કૂચ કરતા",
    "خواتین افسران کی رسمی پریڈ میں مارچ",
    "عورتين آفيسرن جي رسمي پريڊ ۾ مارچ",
  ),
},
{
  id: 26,
  type: "photo",
  src: gallery3,
  caption: lt(
    "Police secure Charminar with interceptor vehicles",
    "चारमीनार पर पुलिस इंटरसेप्टर वाहनों से सुरक्षा",
    "చార్మినార్ వద్ద ఇంటర్‌సెప్టర్ వాహనాలతో పోలీసు భద్రత",
    "ચારમિનાર પર ઇન્ટરસેપ્ટર વાહનો સાથે પોલીસ સુરક્ષા",
    "چارمینار پر انٹرسیپٹر گاڑیوں سے پولیس سیکیورٹی",
    "چارمينار تي انٽرسيپٽر گاڏين سان پوليس سيڪيورٽي",
  ),
},
{
  id: 27,
  type: "photo",
  src: gallery4,
  caption: lt(
    "Cricketer Mohammed Siraj honoured by police",
    "क्रिकेटर मोहम्मद सिराज का पुलिस द्वारा सम्मान",
    "క్రికెటర్ మహమ్మద్ సిరాజ్‌కు పోలీసుల సన్మానం",
    "ક્રિકેટર મોહમ્મદ સિરાજનું પોલીસ દ્વારા સન્માન",
    "کرکٹر محمد سراج کی پولیس کی جانب سے پذیرائی",
    "ڪرڪيٽر محمد سراج جي پوليس پاران پذيرائي",
  ),
},
{
  id: 28,
  type: "photo",
  src: gallery5,
  caption: lt(
    "Dial 112 patrol fleet lined up",
    "डायल 112 गश्ती फ्लीट पंक्तिबद्ध",
    "డయల్ 112 గస్తీ వాహనాల వరుస",
    "ડાયલ 112 પેટ્રોલ ફ્લીટ હરોળમાં ગોઠવાયેલ",
    "ڈائل 112 گشتی فلیٹ قطار میں کھڑی",
    "ڊائل 112 گشتي فليٽ قطار ۾ بيٺل",
  ),
},
{
  id: 29,
  type: "photo",
  src: gallery6,
  caption: lt(
    "Mounted police patrol the lakefront",
    "झील किनारे गश्त करती घुड़सवार पुलिस",
    "సరస్సు తీరంలో గుర్రపు స్వారీ పోలీసు గస్తీ",
    "તળાવ કિનારે ઘોડેસવાર પોલીસ પેટ્રોલિંગ",
    "جھیل کنارے گھڑسوار پولیس کی گشت",
    "ڍنڍ ڪناري گھوڙيسوار پوليس جي گشت",
  ),
},
{
  id: 30,
  type: "photo",
  src: gallery7,
  caption: lt(
    "DGP chairs a command review meeting",
    "डीजीपी की कमांड समीक्षा बैठक",
    "డిజిపి కమాండ్ సమీక్షా సమావేశం",
    "ડીજીપીની કમાન્ડ સમીક્ષા બેઠક",
    "ڈی جی پی کا کمانڈ جائزہ اجلاس",
    "ڊي جي پي جي ڪمانڊ جائزو گڏجاڻي",
  ),
},
{
  id: 31,
  type: "photo",
  src: gallery8,
  caption: lt(
    "T-SPARK briefing on AI-enabled policing",
    "एआई-सक्षम पुलिसिंग पर टी-स्पार्क ब्रीफिंग",
    "AI ఆధారిత పోలీసింగ్‌పై టి-స్పార్క్ బ్రీఫింగ్",
    "AI-સક્ષમ પોલીસિંગ પર ટી-સ્પાર્ક બ્રીફિંગ",
    "AI سے چلنے والی پولیسنگ پر ٹی اسپارک بریفنگ",
    "AI بنياد تي پوليسنگ تي ٽي-اسپارڪ بريفنگ",
  ),
},
{
  id: 32,
  type: "photo",
  src: gallery9,
  caption: lt(
    "Officer addresses a community awareness session",
    "अधिकारी का सामुदायिक जागरूकता सत्र को संबोधन",
    "సామాజిక అవగాహన సదస్సులో అధికారి ప్రసంగం",
    "અધિકારીનું સામુદાયિક જાગૃતિ સત્રમાં સંબોધન",
    "افسر کا کمیونٹی آگاہی سیشن سے خطاب",
    "آفيسر جو ڪميونٽي آگاهي سيشن ڏانهن خطاب",
  ),
},
{
  id: 33,
  type: "photo",
  src: gallery10,
  caption: lt(
    "TGFSL appointment order distribution ceremony",
    "टीजीएफएसएल नियुक्ति आदेश वितरण समारोह",
    "టిజిఎఫ్ఎస్‌ఎల్ నియామక ఉత్తర్వుల పంపిణీ కార్యక్రమం",
    "ટીજીએફએસએલ નિમણૂક હુકમ વિતરણ સમારોહ",
    "ٹی جی ایف ایس ایل تقرری آرڈر تقسیم تقریب",
    "ٽي جي ايف ايس ايل مقرري آرڊر ورهاست تقريب",
  ),
},
{
  id: 34,
  type: "photo",
  src: gallery11,
  caption: lt(
    "DGP addresses forensic laboratory staff",
    "डीजीपी का फॉरेंसिक प्रयोगशाला स्टाफ को संबोधन",
    "ఫోరెన్సిక్ ల్యాబ్ సిబ్బందికి డిజిపి ప్రసంగం",
    "ફોરેન્સિક લેબ સ્ટાફને ડીજીપીનું સંબોધન",
    "فرانزک لیبارٹری عملے سے ڈی جی پی کا خطاب",
    "فارنزڪ ليبارٽري عملي ڏانهن ڊي جي پي جو خطاب",
  ),
},
{
  id: 35,
  type: "photo",
  src: gallery12,
  caption: lt(
    "DGP felicitated by senior officers",
    "वरिष्ठ अधिकारियों द्वारा डीजीपी का सम्मान",
    "సీనియర్ అధికారుల చేత డిజిపి సన్మానం",
    "વરિષ્ઠ અધિકારીઓ દ્વારા ડીજીપીનું સન્માન",
    "سینئر افسران کی جانب سے ڈی جی پی کی پذیرائی",
    "سينئر آفيسرن پاران ڊي جي پي جي پذيرائي",
  ),
},
{
  id: 36,
  type: "photo",
  src: gallery13,
  caption: lt(
    "Senior officers attend a high-level review",
    "वरिष्ठ अधिकारियों की उच्चस्तरीय समीक्षा बैठक",
    "సీనియర్ అధికారుల ఉన్నత స్థాయి సమీక్షా సమావేశం",
    "વરિષ્ઠ અધિકારીઓની ઉચ્ચસ્તરીય સમીક્ષા બેઠક",
    "سینئر افسران کا اعلیٰ سطحی جائزہ اجلاس",
    "سينئر آفيسرن جي اعليٰ سطحي جائزو گڏجاڻي",
  ),
},
{
  id: 37,
  type: "photo",
  src: gallery14,
  caption: lt(
    "Team India jersey presented to Mohammed Siraj",
    "मोहम्मद सिराज को टीम इंडिया जर्सी भेंट",
    "మహమ్మద్ సిరాజ్‌కు టీమ్ ఇండియా జెర్సీ బహూకరణ",
    "મોહમ્મદ સિરાજને ટીમ ઇન્ડિયા જર્સી ભેટ",
    "محمد سراج کو ٹیم انڈیا کی جرسی پیش",
    "محمد سراج کي ٽيم انڊيا جرسي پيش",
  ),
},
{
  id: 38,
  type: "photo",
  src: gallery15,
  caption: lt(
    "DGP briefs senior police officials",
    "डीजीपी का वरिष्ठ अधिकारियों को ब्रीफिंग",
    "సీనియర్ అధికారులకు డిజిపి బ్రీఫింగ్",
    "વરિષ્ઠ અધિકારીઓને ડીજીપીની બ્રીફિંગ",
    "سینئر افسران سے ڈی جی پی کی بریفنگ",
    "سينئر آفيسرن ڏانهن ڊي جي پي جي بريفنگ",
  ),
},
{
  id: 39,
  type: "photo",
  src: gallery16,
  caption: lt(
    "Police leadership review meeting",
    "पुलिस नेतृत्व समीक्षा बैठक",
    "పోలీసు నాయకత్వ సమీక్షా సమావేశం",
    "પોલીસ નેતૃત્વ સમીક્ષા બેઠક",
    "پولیس قیادت کا جائزہ اجلاس",
    "پوليس اڳواڻي جائزو گڏجاڻي",
  ),
},
{
  id: 40,
  type: "photo",
  src: gallery17,
  caption: lt(
    "DGP addresses a press briefing",
    "डीजीपी का प्रेस वार्ता को संबोधन",
    "విలేకరుల సమావేశంలో డిజిపి ప్రసంగం",
    "પત્રકાર પરિષદમાં ડીજીપીનું સંબોધન",
    "پریس بریفنگ سے ڈی جی پی کا خطاب",
    "پريس بريفنگ ۾ ڊي جي پي جو خطاب",
  ),
},
{
  id: 41,
  type: "photo",
  src: gallery18,
  caption: lt(
    "Boxing champion Nikhat Zareen felicitated",
    "मुक्केबाजी चैंपियन निकहत जरीन का सम्मान",
    "బాక్సింగ్ ఛాంపియన్ నిఖత్ జరీన్ సన్మానం",
    "બોક્સિંગ ચેમ્પિયન નિકહત ઝરીનનું સન્માન",
    "باکسنگ چیمپئن نکہت زرین کی پذیرائی",
    "باڪسنگ چيمپئن نڪهت زرين جي پذيرائي",
  ),
},
{
  id: 42,
  type: "photo",
  src: gallery19,
  caption: lt(
    "Insurance cheque presented to officer's family",
    "अधिकारी के परिवार को बीमा चेक भेंट",
    "అధికారి కుటుంబానికి బీమా చెక్కు అందజేత",
    "અધિકારીના પરિવારને વીમા ચેક અર્પણ",
    "افسر کے خاندان کو بیمہ چیک کی پیشکش",
    "آفيسر جي خاندان کي بيمه چيڪ پيشڪش",
  ),
},
{
  id: 43,
  type: "photo",
  src: gallery20,
  caption: lt(
    "Union Home Minister felicitates anti-Naxal personnel",
    "केंद्रीय गृह मंत्री द्वारा नक्सल विरोधी कर्मियों का सम्मान",
    "కేంద్ర హోం మంత్రి చేత నక్సల్ వ్యతిరేక సిబ్బంది సన్మానం",
    "કેન્દ્રીય ગૃહ મંત્રી દ્વારા નક્સલ વિરોધી કર્મચારીઓનું સન્માન",
    "وفاقی وزیر داخلہ کی جانب سے انسداد نکسل اہلکاروں کی پذیرائی",
    "مرڪزي وزيرِ داخلہ پاران نڪسل مخالف اهلڪارن جي پذيرائي",
  ),
},
];
