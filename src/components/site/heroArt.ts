const svg = (body: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice">${body}</svg>`)}`

const dots = (color: string) =>
  Array.from({ length: 36 }, (_, i) => `<circle cx="${14 + (i % 6) * 18.4}" cy="${14 + Math.floor(i / 6) * 18.4}" r="3.2" fill="${color}"/>`).join('')

// Placeholder artwork shown until real portfolio covers fill the hero.
export const HERO_ART: string[] = [
  svg('<rect width="120" height="120" fill="#efe6d6"/><rect x="14" y="14" width="92" height="52" fill="#16349a"/><rect x="14" y="70" width="92" height="36" fill="#d9503a"/>'),
  svg('<rect width="120" height="120" fill="#f4ede1"/><circle cx="60" cy="60" r="38" fill="#ff7a59"/><circle cx="60" cy="60" r="38" fill="url(#g)"/><defs><radialGradient id="g" cx=".35" cy=".3"><stop offset="0" stop-color="#ffd0a8"/><stop offset="1" stop-color="#ff5fa2" stop-opacity=".8"/></radialGradient></defs>'),
  svg('<rect width="120" height="120" fill="#f1f5fb"/>' + Array.from({ length: 7 }, (_, i) => `<rect x="${i * 17.2}" width="9" height="120" fill="${i % 2 ? '#0b3fae' : '#8fb7ee'}"/>`).join('')),
  svg('<rect width="120" height="120" fill="#e9d9bf"/><path d="M22 112V58a38 38 0 0 1 76 0v54z" fill="#c8664a"/><path d="M44 112V64a16 16 0 0 1 32 0v48z" fill="#e9d9bf"/>'),
  svg('<rect width="120" height="120" fill="#0a2f7a"/>' + dots('#ffffff')),
  svg('<rect width="120" height="120" fill="#ffd35a"/><path d="M0 60a60 60 0 0 1 120 0z" fill="#1b4fd6"/><path d="M0 60a60 60 0 0 0 120 0z" fill="#fff6d6"/>'),
  svg('<rect width="120" height="120" fill="#e8f0fc"/><rect x="12" y="16" width="96" height="88" rx="8" fill="#fff"/><rect x="12" y="16" width="96" height="16" rx="8" fill="#cfe0f7"/><circle cx="22" cy="24" r="3" fill="#ff6b57"/><circle cx="31" cy="24" r="3" fill="#ffc24b"/><circle cx="40" cy="24" r="3" fill="#3ddbb0"/><rect x="22" y="42" width="40" height="8" rx="3" fill="#0b57c4"/><rect x="22" y="56" width="76" height="6" rx="3" fill="#d7e2f3"/><rect x="22" y="68" width="60" height="6" rx="3" fill="#d7e2f3"/><rect x="22" y="82" width="28" height="12" rx="6" fill="#ff6b57"/>'),
  svg('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ac8ff"/><stop offset=".55" stop-color="#3a5bff"/><stop offset="1" stop-color="#8a3dff"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="84" cy="34" r="26" fill="#fff" opacity=".22"/>'),
  svg('<rect width="120" height="120" fill="#f3f1ec"/><path d="M60 14l38 22v44L60 102 22 80V36z" fill="#2a6df0"/><path d="M60 14l38 22-38 22-38-22z" fill="#8fb7ff"/><path d="M60 58v44L22 80V36z" fill="#123c9c"/>'),
  svg('<rect width="120" height="120" fill="#0d2f78"/><path d="M0 70q20-24 40 0t40 0 40 0v50H0z" fill="#3ddbb0" opacity=".9"/><path d="M0 88q20-24 40 0t40 0 40 0v32H0z" fill="#5ac8ff"/>'),
  svg('<rect width="120" height="120" fill="#fbeee4"/><circle cx="60" cy="60" r="46" fill="#e8553c"/><circle cx="60" cy="60" r="34" fill="#fbeee4"/><circle cx="60" cy="60" r="22" fill="#e8553c"/><circle cx="60" cy="60" r="10" fill="#fbeee4"/>'),
  svg('<rect width="120" height="120" fill="#101828"/><path d="M0 120L120 0v120z" fill="#ff5fa2"/><path d="M0 0h60L0 60z" fill="#5ac8ff"/>'),
  svg('<rect width="120" height="120" fill="#eef3fb"/><rect x="14" y="18" width="92" height="18" rx="9" fill="#0b57c4"/><rect x="14" y="44" width="68" height="18" rx="9" fill="#ff6b57"/><rect x="14" y="70" width="80" height="18" rx="9" fill="#ffc24b"/><rect x="14" y="96" width="44" height="12" rx="6" fill="#3ddbb0"/>'),
  svg('<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb47a"/><stop offset=".6" stop-color="#ff6b8a"/><stop offset="1" stop-color="#5a3dff"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="60" cy="72" r="24" fill="#fff3c9"/><rect y="84" width="120" height="36" fill="#1b2a6b"/>'),
  svg('<rect width="120" height="120" fill="#f5f7fb"/><rect x="16" y="70" width="14" height="34" rx="3" fill="#a9c6f2"/><rect x="38" y="54" width="14" height="50" rx="3" fill="#6f9fe6"/><rect x="60" y="38" width="14" height="66" rx="3" fill="#2a6df0"/><rect x="82" y="20" width="14" height="84" rx="3" fill="#0a3fae"/><path d="M20 62L45 46l22-16 28-14" stroke="#ff6b57" stroke-width="4" fill="none" stroke-linecap="round"/>'),
  svg('<rect width="120" height="120" fill="#fff4dc"/><path d="M0 0h40L0 40z" fill="#ff6b57"/><path d="M40 0h40L40 40z" fill="#ffc24b"/><path d="M80 0h40L80 40z" fill="#3ddbb0"/><path d="M0 40h40L0 80z" fill="#0b57c4"/><path d="M40 40h40L40 80z" fill="#8a3dff"/><path d="M80 40h40L80 80z" fill="#ff6b57"/><path d="M0 80h40L0 120z" fill="#ffc24b"/><path d="M40 80h40L40 120z" fill="#0b57c4"/><path d="M80 80h40L80 120z" fill="#3ddbb0"/>'),
  svg('<defs><radialGradient id="g" cx=".3" cy=".25"><stop offset="0" stop-color="#e9f4ff"/><stop offset=".6" stop-color="#9ec8ff"/><stop offset="1" stop-color="#4a86ee"/></radialGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="82" cy="84" r="30" fill="#fff" opacity=".35"/>'),
  svg('<rect width="120" height="120" fill="#e9eefb"/><circle cx="40" cy="48" r="26" fill="#ff6b57" opacity=".9"/><circle cx="76" cy="48" r="26" fill="#0b57c4" opacity=".85"/><circle cx="58" cy="78" r="26" fill="#ffc24b" opacity=".9"/>'),
]
