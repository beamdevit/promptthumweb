'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translate, type SiteLocale } from '@/lib/site-translations'

const LanguageContext = createContext({ locale: 'th' as SiteLocale, setLocale: (_locale: SiteLocale) => {} })

export function SiteLanguage({ initialLocale, children }: { initialLocale: SiteLocale; children: ReactNode }) {
  const [locale, setLocale] = useState(initialLocale)
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  function changeLocale(next: SiteLocale) {
    document.cookie = `site-language=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
    setLocale(next)
  }
  return <LanguageContext.Provider value={{ locale, setLocale: changeLocale }}>{children}</LanguageContext.Provider>
}

export function useSiteLanguage() {
  const context = useContext(LanguageContext)
  return { ...context, t: (text: string) => translate(text, context.locale) }
}

export function T({ children, en }: { children: string; en?: string }) {
  const { t, locale } = useSiteLanguage()
  return <>{locale === 'en' && en ? en : t(children)}</>
}

export function SiteDate({ value }: { value: string }) {
  const { locale } = useSiteLanguage()
  return <>{new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Bangkok' }).format(new Date(value))}</>
}

export function LocalizedContent({ th, en }: { th: ReactNode; en: ReactNode }) {
  const { locale } = useSiteLanguage()
  return <>{locale === 'en' ? en : th}</>
}
