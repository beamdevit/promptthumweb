'use client'

import { usePathname } from 'next/navigation'

export function AdminBrand() {
  const pathname = usePathname()
  return (
    <div className="pt-nav-brand">
      <a className="pt-brand" href="/admin">
        <img className="pt-nav-logo" src="/assets/admin-logo.png" alt="Promptthum" width="1040" height="495" />
        <small>จัดการเว็บไซต์</small>
      </a>
      <a
        className={
          'pt-nav-home' + (pathname === '/admin' ? ' pt-nav-home--active' : '')
        }
        href="/admin"
        aria-current={pathname === '/admin' ? 'page' : undefined}
      >
        <span aria-hidden="true">▦</span> ภาพรวมระบบ
      </a>
      <a
        className="pt-nav-home"
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span aria-hidden="true">↗</span> เปิดเว็บไซต์
      </a>
    </div>
  )
}
