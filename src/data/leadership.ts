import type { LeaderProfile } from "@/types/content";
import type { LocalizedText } from "@/i18n/locales";
import dgpPhoto from "@/assets/leader3Tel.jpeg";
import directorPhoto from "@/assets/leader2Tel.jpeg";
import cmPhoto from "@/assets/leader1Tel.png";

function lt(en: string, hi: string, te: string, gu: string, ur: string, sd: string): LocalizedText {
  return { en, hi, te, gu, ur, sd };
}

export const leadership: LeaderProfile[] = [
  {
    name: "Sri A. Revanth Reddy",
    title: lt(
      "Hon'ble Chief Minister, Telangana",
      "माननीय मुख्यमंत्री, तेलंगाना",
      "గౌరవ ముఖ్యమంత్రి, తెలంగాణ",
      "માનનીય મુખ્યમંત્રી, તેલંગાણા",
      "معزز وزیر اعلیٰ، تلنگانہ",
      "معزز وزيراعليٰ، تلنگانه",
    ),
    initials: "RR",
    image: cmPhoto,
  },
  {
    name: "Sri C. V. Anand , IPS",
    title: lt(
      "Director General of Police, Telangana",
      "पुलिस महानिदेशक, तेलंगाना",
      "పోలీసు డైరెక్టర్ జనరల్, తెలంగాణ",
      "પોલીસ મહાનિદેશક, તેલંગાણા",
      "ڈائریکٹر جنرل آف پولیس، تلنگانہ",
      "ڊائريڪٽر جنرل آف پوليس، تلنگانه",
    ),
    initials: "DJ",
    image: dgpPhoto,
  },
  {
    name: "Sri V. B. Kamalasan Reddy, IPS (Retired)",
    title: lt(
      "Director, Telangana State Integrated Command & Control Centre",
      "निदेशक, तेलंगाना राज्य एकीकृत कमांड एवं नियंत्रण केंद्र",
      "డైరెక్టర్, తెలంగాణ రాష్ట్ర సమీకృత కమాండ్ మరియు నియంత్రణ కేంద్రం",
      "નિયામક, તેલંગાણા રાજ્ય સંકલિત કમાન્ડ અને નિયંત્રણ કેન્દ્ર",
      "ڈائریکٹر، تلنگانہ اسٹیٹ انٹیگریٹڈ کمانڈ اینڈ کنٹرول سینٹر",
      "ڊائريڪٽر، تلنگانا اسٽيٽ انٽيگريٽيڊ ڪمانڊ ائنڊ ڪنٽرول سينٽر",
    ),
    initials: "KR",
    image: directorPhoto,
  },
];
