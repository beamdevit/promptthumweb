'use client'

import { T, useSiteLanguage } from '@/components/site/SiteLanguage'
import { usePathname } from 'next/navigation'
import { SiteLogo } from './SiteLogo'


import { useEffect, useState } from 'react'

export function SiteHeader() {
  const { locale, setLocale, t } = useSiteLanguage()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`} id="top">
      <div className="wrap header-inner">
        <a className="logo" href="/" aria-label="Promptthum">
          <SiteLogo priority />
        </a>

        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} id="main-nav" aria-label={t('เมนูหลัก')}>
          <ul>
            <li><a className="nav-link" href="/" aria-current={pathname === '/' ? 'page' : undefined} onClick={() => setMenuOpen(false)}><T>หน้าแรก</T></a></li>
            <li>
              <a className="nav-link" href="/portfolio" aria-current={pathname.startsWith('/portfolio') ? 'page' : undefined} onClick={() => setMenuOpen(false)}><T>ผลงาน</T></a>
            </li>
            <li>
              <a className="nav-link" href="/articles" aria-current={pathname.startsWith('/articles') ? 'page' : undefined} onClick={() => setMenuOpen(false)}><T>บทความ</T></a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button type="button" className="lang-badge" aria-label={locale === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'} onClick={() => setLocale(locale === 'th' ? 'en' : 'th')}>
            <span lang="en">{locale === 'th' ? 'TH' : 'EN'}</span>
            <span className="sr-only">{locale === 'th' ? ' — ภาษาปัจจุบัน: ไทย' : ' — Current language: English'}</span>
          </button>
          <a className="btn btn-outline btn-sm" href="/#contact"><T>ปรึกษาฟรี</T></a>
          <a className="btn btn-ink btn-sm" href="/#contact"><T>ขอใบเสนอราคา</T></a>
          <button
            className="menu-toggle"
            aria-label={t(menuOpen ? 'ปิดเมนู' : 'เปิดเมนู')}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}
