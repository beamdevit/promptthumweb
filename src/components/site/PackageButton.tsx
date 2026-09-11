'use client'

import { SELECT_PACKAGE_EVENT, type SelectPackageDetail } from '@/lib/selectPackage'

type Props = {
  budget: string
  label: string
  className: string
}

export function PackageButton({ budget, label, className }: Props) {
  const onClick = () => {
    const detail: SelectPackageDetail = { budget, label }
    window.dispatchEvent(new CustomEvent<SelectPackageDetail>(SELECT_PACKAGE_EVENT, { detail }))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button className={className} type="button" onClick={onClick}>
      เลือก
    </button>
  )
}
