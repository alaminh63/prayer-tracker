export interface AzkarItem {
  id: string
  arabic: string
  translationBn: string
  repetition: number
  reference: string
}

export const MORNING_AZKAR: AzkarItem[] = [
  {
    id: "m-1",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    translationBn: "আমরা সকালে উপনীত হয়েছি এবং রাজত্বও আল্লাহর হয়ে সকালে উপনীত হয়েছে। সকল প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি এক, তার কোনো শরিক নেই।",
    repetition: 1,
    reference: "Muslim"
  },
  {
    id: "m-2",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    translationBn: "হে আল্লাহ! আপনার মাধ্যমেই আমরা সকালে উপনীত হই এবং আপনার মাধ্যমেই সন্ধ্যায় উপনীত হই। আপনার মাধ্যমেই আমরা জীবিত থাকি, আপনার মাধ্যমেই আমরা মৃত্যুবরণ করি এবং আপনার দিকেই ফিরে যেতে হবে।",
    repetition: 1,
    reference: "Tirmidhi"
  }
]

export const EVENING_AZKAR: AzkarItem[] = [
  {
    id: "e-1",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    translationBn: "আমরা সন্ধ্যায় উপনীত হয়েছি এবং রাজত্বও আল্লাহর হয়ে সন্ধ্যায় উপনীত হয়েছে। সকল প্রশংসা আল্লাহর।",
    repetition: 1,
    reference: "Muslim"
  }
]
