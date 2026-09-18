'use client'

import { usePathname } from 'next/navigation'

export function AdminBrand() {
  const pathname = usePathname()
  return <div className="pt-nav-brand"><a className="pt-brand" href="/admin"><span className="pt-brand-mark" aria-hidden="true">P</span><span><strong>Promptthum</strong><small>จัดการเว็บไซต์</small></span></a><a className={'pt-nav-home' + (pathname === '/admin' ? ' pt-nav-home--active' : '')} href="/admin" aria-current={pathname === '/admin' ? 'page' : undefined}><span aria-hidden="true">▦</span> ภาพรวมระบบ</a><a className="pt-nav-home" href="/" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> เปิดเว็บไซต์</a></div>
}
