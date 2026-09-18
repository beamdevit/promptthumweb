'use client'

import { useEffect, useState } from 'react'

export function SiteHeader() {
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="Promptthum" />
        </a>

        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} id="main-nav">
          <ul>
            <li>
              <a className="nav-link" href="/portfolio">ผลงาน</a>
            </li>
            <li>
              <a className="nav-link" href="/#articles">บทความ</a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <span className="lang-badge" aria-label="ภาษาไทย">TH</span>
          <a className="btn btn-outline btn-sm" href="/#contact">ปรึกษาฟรี</a>
          <a className="btn btn-ink btn-sm" href="/#contact">ขอใบเสนอราคา</a>
          <button
            className="menu-toggle"
            aria-label="เปิดเมนู"
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
