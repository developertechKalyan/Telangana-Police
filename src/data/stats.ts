import type { ImpactStat, DecadeStat, DailyStat } from "@/types/content";
import type { LocalizedText } from "@/i18n/locales";

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

export const impactStats: ImpactStat[] = [
  {
    label: lt(
      "Women's Safety Responses",
      "महिला सुरक्षा प्रतिक्रियाएं",
      "మహిళా భద్రతా స్పందనలు",
      "મહિલા સલામતી પ્રતિભાવો",
      "خواتین کی حفاظت کے ردعمل",
      "عورتن جي حفاظت جا ردعمل",
    ),
    value: 270517,
  },
  {
    label: lt(
      "Road Accident Rescues",
      "सड़क दुर्घटना बचाव",
      "రోడ్డు ప్రమాద రక్షణలు",
      "માર્ગ અકસ્માત બચાવ",
      "روڈ حادثہ ریسکیو",
      "روڊ حادثي ريسڪيو",
    ),
    value: 133252,
  },
  {
    label: lt(
      "Missing Children Traced",
      "गुमशुदा बच्चे बरामद",
      "తప్పిపోయిన పిల్లలు కనుగొనబడ్డారు",
      "ગુમ થયેલા બાળકો શોધાયા",
      "لاپتہ بچے بازیاب",
      "گم ٿيل ٻار مليا",
    ),
    value: 3953,
  },
  {
    label: lt(
      "Suicide / Depression Interventions",
      "आत्महत्या / अवसाद हस्तक्षेप",
      "ఆత్మహత్య / డిప్రెషన్ జోక్యాలు",
      "આત્મહત્યા / ડિપ્રેશન હસ્તક્ષેપ",
      "خودکشی / ڈپریشن مداخلت",
      "خودڪشي / ڊپريشن مداخلت",
    ),
    value: 27860,
  },
];

export const decadeStats: DecadeStat[] = [
  {
    label: lt(
      "Total Calls This Year",
      "इस वर्ष कुल कॉल",
      "ఈ సంవత్సరం మొత్తం కాల్స్",
      "આ વર્ષે કુલ કૉલ",
      "اس سال کی کل کالز",
      "هن سال جون ڪل ڪالون",
    ),
    total: 7504289,
    thisMonth: 148612,
    last24h: 1266,
    updated: "23 Jul",
  },
  {
    label: lt(
      "Actionable Calls",
      "कार्यवाही योग्य कॉल",
      "చర్య తీసుకోదగిన కాల్స్",
      "કાર્યવાહી કરી શકાય તેવા કૉલ",
      "قابلِ عمل کالز",
      "قابل عمل ڪالون",
    ),
    total: 2582468,
    thisMonth: 110177,
    last24h: 1534,
    updated: "23 Jul",
  },
  {
    label: lt(
      "Assistance to Senior Citizens",
      "वरिष्ठ नागरिकों को सहायता",
      "వృద్ధ పౌరులకు సహాయం",
      "વરિષ્ઠ નાગરિકોને સહાય",
      "بزرگ شہریوں کی معاونت",
      "بزرگ شهرين جي مدد",
    ),
    total: 29768,
    thisMonth: 1956,
    last24h: 25,
    updated: "23 Jul",
  },
  {
    label: lt(
      "Women Safety Responses",
      "महिला सुरक्षा प्रतिक्रियाएं",
      "మహిళా భద్రతా స్పందనలు",
      "મહિલા સલામતી પ્રતિભાવો",
      "خواتین کی حفاظت کے ردعمل",
      "عورتن جي حفاظت جا ردعمل",
    ),
    total: 2021300,
    thisMonth: 92835,
    last24h: 1284,
    updated: "23 Jul",
  },
];

export const dailyStats: DailyStat[] = [
  {
    label: lt("Police Events", "पुलिस घटनाएं", "పోలీసు ఘటనలు", "પોલીસ ઘટનાઓ", "پولیس واقعات", "پوليس واقعا"),
    total: 7783,
    male: 6430,
    female: 1353,
  },
  {
    label: lt("Emergency (FRV)", "आपातकाल (एफआरवी)", "అత్యవసరం (ఎఫ్‌ఆర్‌వి)", "કટોકટી (એફઆરવી)", "ایمرجنسی (ایف آر وی)", "ايمرجنسي (ايف آر وي)"),
    total: 7126,
    male: 5833,
    female: 1293,
  },
  {
    label: lt("NON FRV", "गैर-एफआरवी", "నాన్-ఎఫ్‌ఆర్‌వి", "નોન-એફઆરવી", "غیر ایف آر وی", "غير ايف آر وي"),
    total: 657,
    male: 597,
    female: 60,
  },
  {
    label: lt("Medical Assistance", "चिकित्सा सहायता", "వైద్య సహాయం", "તબીબી સહાય", "طبی امداد", "طبي مدد"),
    total: 19,
    male: 0,
    female: 19,
  },
  {
    label: lt("Women Related", "महिला संबंधित", "మహిళా సంబంధిత", "મહિલા સંબંધિત", "خواتین سے متعلق", "عورتن سان لاڳاپيل"),
    total: 1084,
    male: 471,
    female: 613,
  },
  {
    label: lt("Child Related", "बाल संबंधित", "బాలల సంబంధిత", "બાળ સંબંધિત", "بچوں سے متعلق", "ٻارن سان لاڳاپيل"),
    total: 111,
    male: 76,
    female: 35,
  },
  {
    label: lt("Cyber", "साइबर", "సైబర్", "સાયબર", "سائبر", "سائبر"),
    total: 1962,
    male: 1781,
    female: 181,
  },
  {
    label: lt("Crashes / Accidents", "दुर्घटनाएं", "ప్రమాదాలు", "અકસ્માતો", "حادثات", "حادثا"),
    total: 441,
    male: 429,
    female: 12,
  },
];

export const aboutStats: ImpactStat[] = [
  {
    label: lt(
      "Emergency Calls Answered",
      "आपातकालीन कॉल का जवाब दिया गया",
      "సమాధానమిచ్చిన అత్యవసర కాల్స్",
      "કટોકટી કૉલનો જવાબ આપ્યો",
      "ایمرجنسی کالز کا جواب دیا گیا",
      "ايمرجنسي ڪالن جو جواب ڏنو ويو",
    ),
    value: 8.99,
    suffix: lt(" Cr+", " करोड़+", " కోటి+", " કરોડ+", " کروڑ+", " ڪروڙ+"),
  },
  {
    label: lt(
      "Average Response Time",
      "औसत प्रतिक्रिया समय",
      "సగటు స్పందన సమయం",
      "સરેરાશ પ્રતિભાવ સમય",
      "اوسط ردعمل کا وقت",
      "اوسط ردعمل جو وقت",
    ),
    value: 16,
    suffix: lt(" min", " मिनट", " నిమిషాలు", " મિનિટ", " منٹ", " منٽ"),
  },
  {
    label: lt("Units Covered", "इकाइयां कवर की गईं", "కవర్ చేయబడిన యూనిట్లు", "આવરી લેવાયેલા યુનિટ", "احاطہ کی گئی یونٹس", "ڍڪيل يونٽ"),
    value: 31,
  },
  {
    label: lt("Year of Launch", "शुभारंभ का वर्ष", "ప్రారంభ సంవత్సరం", "લોન્ચનું વર્ષ", "آغاز کا سال", "شروعات جو سال"),
    value: 2013,
  },
];
