export interface Dua {
  id: string
  title: string
  titleBn: string
  arabic: string
  translationBn: string
  translationEn: string
  reference: string
}

export const DUA_DATA: Dua[] = [
  {
    id: "dua-waking-up",
    title: "After Waking Up",
    titleBn: "ঘুম থেকে উঠে পড়ার দোয়া",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    translationBn: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত (নিদ্রা) হওয়ার পর জীবিত করেছেন এবং তাঁর দিকেই উথান হবে।",
    translationEn: "Praise is to Allah Who gives us life after He has caused us to die and to Him is the return.",
    reference: "Sahih Bukhari"
  },
  {
    id: "dua-entering-toilet",
    title: "Before Entering Toilet",
    titleBn: "টয়লেটে প্রবেশের আগে পড়ার দোয়া",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    translationBn: "হে আল্লাহ! আমি আপনার নিকটে অপবিত্র জিন নারী ও পুরুষের অনিষ্ট থেকে পানাহ চাচ্ছি।",
    translationEn: "O Allah, I seek refuge with You from all offensive and wicked things.",
    reference: "Sahih Bukhari"
  },
  {
    id: "dua-leaving-toilet",
    title: "After Leaving Toilet",
    titleBn: "টয়লেট থেকে বের হয়ে পড়ার দোয়া",
    arabic: "غُفْرَانَكَ",
    translationBn: "(হে আল্লাহ!) আমি আপনার ক্ষমা প্রার্থনা করছি।",
    translationEn: "I seek Your forgiveness.",
    reference: "Abu Dawud"
  },
  {
    id: "dua-eating-start",
    title: "Before Eating",
    titleBn: "খাবার শুরুতে পড়ার দোয়া",
    arabic: "بِسْمِ اللَّهِ",
    translationBn: "আল্লাহর নামে (শুরু করছি)।",
    translationEn: "In the name of Allah.",
    reference: "Sahih Muslim"
  }
]
