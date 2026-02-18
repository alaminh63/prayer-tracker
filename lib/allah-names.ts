export interface AllahName {
  id: number
  arabic: string
  transliteration: string
  meaningBn: string
  meaningEn: string
}

export const ALLAH_NAMES: AllahName[] = [
  { id: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaningBn: "পরম দয়ালু", meaningEn: "The Most Gracious" },
  { id: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Rahim", meaningBn: "অতিশয় মেহেরবান", meaningEn: "The Most Merciful" },
  { id: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaningBn: "সর্বভৌম ক্ষমতার অধিকারী", meaningEn: "The King" },
  { id: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaningBn: "নিষ্পাপ ও অতি পবিত্র", meaningEn: "The Most Holy" },
  { id: 5, arabic: "السَّلَامُ", transliteration: "As-Salam", meaningBn: "শান্তি দানকারী", meaningEn: "The Giver of Peace" },
  { id: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaningBn: "নিরাপত্তা দানকারী", meaningEn: "The Giver of Security" },
  { id: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaningBn: "রক্ষণাবেক্ষণকারী", meaningEn: "The Guardian" },
  { id: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaningBn: "মহাসম্মানিত", meaningEn: "The All Mighty" },
  { id: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaningBn: "মহাপ্রতাপশালী", meaningEn: "The Compeller" },
  { id: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaningBn: "মহা গৌরবান্বিত", meaningEn: "The Supreme" },
  // ... Truncated for implementation, will provide a representative set for the UI
  { id: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaningBn: "সৃষ্টিকর্তা", meaningEn: "The Creator" },
  { id: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari'", meaningBn: "উদ্ভাবক", meaningEn: "The Originator" },
  { id: 13, arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaningBn: "রূপদানকারী", meaningEn: "The Fashioner" },
  { id: 14, arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaningBn: "ক্ষমাকারী", meaningEn: "The All-Forgiving" },
  { id: 15, arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaningBn: "দমনকারী", meaningEn: "The Subduer" },
]
