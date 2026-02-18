export interface IslamicEvent {
  id: string
  name: string
  nameBn: string
  description?: string
  hijriDay: number
  hijriMonth: number // 1-indexed (1: Muharram, ..., 12: Dhul-Hijjah)
  type: "holiday" | "observance"
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: "ashura",
    name: "Ashura",
    nameBn: "আশুরা",
    hijriDay: 10,
    hijriMonth: 1,
    type: "observance",
  },
  {
    id: "mawlid",
    name: "Mawlid un-Nabi",
    nameBn: "ঈদে মিলাদুন্নবী (সা.)",
    hijriDay: 12,
    hijriMonth: 3,
    type: "holiday",
  },
  {
    id: "meraj",
    name: "Lailat al-Miraj",
    nameBn: "শবে মেরাজ",
    hijriDay: 27,
    hijriMonth: 7,
    type: "observance",
  },
  {
    id: "barat",
    name: "Lailat al-Bara'at",
    nameBn: "শবে বরাত",
    hijriDay: 15,
    hijriMonth: 8,
    type: "observance",
  },
  {
    id: "ramadan-start",
    name: "Start of Ramadan",
    nameBn: "রমজান শুরু",
    hijriDay: 1,
    hijriMonth: 9,
    type: "observance",
  },
  {
    id: "laylat-al-qadr",
    name: "Laylat al-Qadr",
    nameBn: "শবে কদর",
    hijriDay: 27,
    hijriMonth: 9,
    type: "observance",
  },
  {
    id: "eid-ul-fitr",
    name: "Eid-ul-Fitr",
    nameBn: "ঈদুল ফিতর",
    hijriDay: 1,
    hijriMonth: 10,
    type: "holiday",
  },
  {
    id: "eid-ul-adha",
    name: "Eid-ul-Adha",
    nameBn: "ঈদুল আযহা",
    hijriDay: 10,
    hijriMonth: 12,
    type: "holiday",
  },
]

export const HIJRI_MONTHS = [
  { en: "Muharram", bn: "মুহররম" },
  { en: "Safar", bn: "সফর" },
  { en: "Rabi' al-Awwal", bn: "রবিউল আউয়াল" },
  { en: "Rabi' al-Thani", bn: "রবিউস সানি" },
  { en: "Jumada al-Awwal", bn: "জমাদিউল আউয়াল" },
  { en: "Jumada al-Thani", bn: "জমাদিউস সানি" },
  { en: "Rajab", bn: "রজব" },
  { en: "Sha'ban", bn: "শা'বান" },
  { en: "Ramadan", bn: "রমজান" },
  { en: "Shawwal", bn: "শাওয়াল" },
  { en: "Dhu al-Qi'dah", bn: "জিলকদ" },
  { en: "Dhu al-Hijjah", bn: "জিলহজ" },
]
