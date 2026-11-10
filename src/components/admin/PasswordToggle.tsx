'use client'

import { useEffect } from 'react'

const EYE =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>'
const EYE_OFF =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.9 10.9 0 0 1 12 19C5.6 19 2 12 2 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>'

export function PasswordToggle() {
  useEffect(() => {
    const added: Array<{ input: HTMLInputElement; button: HTMLButtonElement }> = []

    const attach = () => {
      document
        .querySelectorAll<HTMLInputElement>('input[type="password"]:not([data-pt-pw])')
        .forEach((input) => {
          const wrap = input.parentElement
          if (!wrap) return
          input.dataset.ptPw = '1'
          wrap.classList.add('pt-pw-wrap')

          const button = document.createElement('button')
          button.type = 'button'
          button.className = 'pt-pw-toggle'
          button.setAttribute('aria-label', 'แสดงรหัสผ่าน')
          button.setAttribute('aria-pressed', 'false')
          button.innerHTML = EYE
          button.addEventListener('click', () => {
            const show = input.type === 'password'
            input.type = show ? 'text' : 'password'
            button.innerHTML = show ? EYE_OFF : EYE
            button.setAttribute('aria-label', show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน')
            button.setAttribute('aria-pressed', String(show))
          })
          wrap.appendChild(button)
          added.push({ input, button })
        })
    }

    attach()
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      added.forEach(({ input, button }) => {
        input.type = 'password'
        delete input.dataset.ptPw
        input.parentElement?.classList.remove('pt-pw-wrap')
        button.remove()
      })
    }
  }, [])

  return null
}
