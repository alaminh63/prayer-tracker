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
  },
  {
    id: "dua-travel",
    title: "Before Traveling",
    titleBn: "সফরের দোয়া",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    translationBn: "পবিত্র সেই সত্তা যিনি এগুলোকে আমাদের বশীভূত করে দিয়েছেন, অথচ আমরা এগুলোকে বশ করতে সক্ষম ছিলাম না। আর অবশ্যই আমরা আমাদের প্রতিপালকের দিকে ফিরে যাব।",
    translationEn: "Glory be to Him Who has brought this [vehicle] under our control, though we were unable to do so ourselves. And indeed, to our Lord we will return.",
    reference: "Surah Az-Zukhruf 13-14"
  },
  {
    id: "dua-parents",
    title: "Dua for Parents",
    titleBn: "বাবা-মায়ের জন্য দোয়া",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translationBn: "হে আমার প্রতিপালক! আপনি তাদের প্রতি রহম করুন যেভাবে তারা আমাকে শৈশবে পরম মমতায় লালন-পালন করেছেন।",
    translationEn: "My Lord, have mercy upon them as they brought me up [when I was] small.",
    reference: "Surah Al-Isra 24"
  },
  {
    id: "dua-success",
    title: "Dua for Success",
    titleBn: "দুনিয়া ও আখিরাতে কল্যাণের দোয়া",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translationBn: "হে আমাদের প্রতিপালক! আমাদের দুনিয়াতে কল্যাণ দিন এবং আখিরাতেও কল্যাণ দিন এবং আমাদের দোযখের আগুন থেকে রক্ষা করুন।",
    translationEn: "Our Lord, give us in this world [that which is] good and in the afterlife [that which is] good and protect us from the punishment of the Fire.",
    reference: "Surah Al-Baqarah 201"
  },
  {
    id: "dua-forgiveness",
    title: "Dua for Forgiveness",
    titleBn: "গুনাহ মাফের দোয়া",
    arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    translationBn: "হে আমাদের প্রতিপালক! আমাদের গুনাহসমূহ এবং আমাদের কাজের সীমালঙ্ঘন ক্ষমা করে দিন, আমাদের পদক্ষেপসমূহ সুদৃঢ় করুন এবং কাফির সম্প্রদায়ের বিরুদ্ধে আমাদের সাহায্য করুন।",
    translationEn: "Our Lord, forgive us our sins and the excess [committed] in our affairs and plant firmly our feet and give us victory over the disbelieving people.",
    reference: "Surah Ali 'Imran 147"
  }
]
