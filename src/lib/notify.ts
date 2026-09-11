type LeadSummary = {
  name: string
  contact: string
  budget?: string
  packageInterest?: string
  message?: string
}

function buildText(lead: LeadSummary) {
  return [
    '🔔 มีข้อความติดต่อใหม่',
    `ชื่อ: ${lead.name}`,
    `ติดต่อ: ${lead.contact}`,
    lead.budget && lead.budget !== 'unspecified' ? `งบประมาณ: ${lead.budget}` : null,
    lead.packageInterest ? `แพ็กเกจที่สนใจ: ${lead.packageInterest}` : null,
    lead.message ? `รายละเอียด: ${lead.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

async function pushToLine(text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const to = process.env.LINE_NOTIFY_TO
  if (!token || !to) return

  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to, messages: [{ type: 'text', text }] }),
  })

  if (!res.ok) {
    throw new Error(`LINE push failed: ${res.status} ${await res.text()}`)
  }
}

async function sendEmail(text: string) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFY_EMAIL
  const from = process.env.LEAD_FROM_EMAIL
  if (!apiKey || !to || !from) return

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject: 'Promptthum: ข้อความติดต่อใหม่', text }),
  })

  if (!res.ok) {
    throw new Error(`Email send failed: ${res.status} ${await res.text()}`)
  }
}

/**
 * Notification must never fail the submission — the lead is already saved by the
 * time this runs, so a dead LINE token should not show the visitor an error.
 */
export async function notifyNewLead(lead: LeadSummary) {
  const text = buildText(lead)

  const results = await Promise.allSettled([pushToLine(text), sendEmail(text)])

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[lead-notify]', result.reason)
    }
  }
}
