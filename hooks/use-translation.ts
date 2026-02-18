import { useAppSelector } from "@/store/hooks"
import { translations } from "@/lib/translations"

export function useTranslation() {
  const language = useAppSelector((state) => state.settings.language)
  
  const t = translations[language] || translations.bn

  return { t, language }
}
