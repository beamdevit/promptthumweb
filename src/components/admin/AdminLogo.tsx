export function AdminLogo() {
  return (
    <div className="pt-login-brand">
      <div className="pt-login-logo">
        <img src="/assets/logo.png" alt="Promptthum" />
      </div>
      <h1>จัดการเว็บไซต์ Promptthum</h1>
      <p>เข้าสู่ระบบเพื่อจัดการเนื้อหาและข้อมูลติดต่อ</p>
    </div>
  )
}

export function AdminIcon() {
  return (
    <svg className="pt-admin-icon" viewBox="0 0 36 36" width="100%" height="100%" role="img" aria-label="Promptthum">
      <rect width="36" height="36" rx="10" fill="#016ac6" />
      <path d="M11 9h8a7 7 0 0 1 0 14h-3v5h-5V9Zm5 5v4h3a2 2 0 0 0 0-4h-3Z" fill="#fff" />
    </svg>
  )
}
