export const ANALYTICS_CONSENT_KEY = 'promptthum:cookie-consent'
export const ANALYTICS_CONSENT_EVENT = 'promptthum:consent-change'
export const ANALYTICS_SESSION_SECONDS = 30 * 60

export type VisitorDevice = 'mobile' | 'tablet' | 'desktop' | 'other'
export type VisitorReport = {
  start: string
  end: string
  visits: number
  today: number
  uniqueVisitors: number
  allTime: number
  startedAt: string | null
  daily: { date: string; visits: number }[]
  sources: { label: string; visits: number }[]
  devices: { label: VisitorDevice; visits: number }[]
}

export function thaiDay(now = new Date()) {
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function shiftDay(day: string, days: number) {
  const date = new Date(day + 'T00:00:00Z')
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function validDay(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false
  const date = new Date(day + 'T00:00:00Z')
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === day
}

export function visitorRange(start: string, end: string, now = new Date()) {
  if (!validDay(start) || !validDay(end)) throw new Error('กรุณาเลือกวันที่ให้ถูกต้อง')
  if (start > end) throw new Error('วันเริ่มต้นต้องไม่อยู่หลังวันสิ้นสุด')
  if (end > thaiDay(now)) throw new Error('กรุณาเลือกวันที่ไม่เกินวันนี้')
  const days = (Date.parse(end) - Date.parse(start)) / 86400000 + 1
  if (days > 366) throw new Error('เลือกช่วงวันที่ได้ครั้งละไม่เกิน 366 วัน')
  return {
    start,
    end,
    from: new Date(start + 'T00:00:00+07:00').toISOString(),
    until: new Date(shiftDay(end, 1) + 'T00:00:00+07:00').toISOString(),
    todayFrom: new Date(thaiDay(now) + 'T00:00:00+07:00').toISOString(),
    todayUntil: new Date(shiftDay(thaiDay(now), 1) + 'T00:00:00+07:00').toISOString(),
  }
}

export function defaultVisitorRange(now = new Date(), days = 30) {
  const end = thaiDay(now)
  return { start: shiftDay(end, -(days - 1)), end }
}

export function deviceFromUserAgent(agent: string): VisitorDevice {
  if (/ipad|tablet|kindle|silk|android(?!.*mobile)/i.test(agent)) return 'tablet'
  if (/mobi|iphone|ipod|android/i.test(agent)) return 'mobile'
  if (/windows|macintosh|linux|cros/i.test(agent)) return 'desktop'
  return 'other'
}

export function isBot(agent: string) {
  return /bot\b|crawler|spider|headless|slurp|facebookexternalhit|preview|monitor|lighthouse/i.test(agent)
}

export function trafficSource(referrer: unknown, campaign: unknown, host: string) {
  if (typeof campaign === 'string' && /^[a-z0-9][a-z0-9_-]{0,39}$/i.test(campaign))
    return 'utm:' + campaign.toLowerCase()
  if (typeof referrer !== 'string' || referrer.length > 2048) return 'direct'
  try {
    const url = new URL(referrer)
    if (!['https:', 'http:'].includes(url.protocol) || url.host === host) return 'direct'
    return url.hostname.toLowerCase().replace(/^www\./, '').slice(0, 120)
  } catch {
    return 'direct'
  }
}

export function trackedPath(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null
  const path = value.split(/[?#]/, 1)[0]
  if (path.length > 240 || /[\s\\\u0000-\u001f]/.test(path)) return null
  if (/^\/(admin|api|_next)(\/|$)/.test(path)) return null
  return path
}

export function sourceLabel(source: string) {
  if (source === 'direct') return 'เข้าชมโดยตรง'
  if (source.startsWith('utm:')) return source.slice(4) + ' (แคมเปญ)'
  if (/(^|\.)google\./.test(source)) return 'Google'
  if (/(^|\.)(facebook\.com|fb\.com)$/.test(source)) return 'Facebook'
  if (/(^|\.)instagram\.com$/.test(source)) return 'Instagram'
  if (/(^|\.)(line\.me|lin\.ee)$/.test(source)) return 'LINE'
  if (/(^|\.)youtube\.com$/.test(source) || source === 'youtu.be') return 'YouTube'
  if (/(^|\.)tiktok\.com$/.test(source)) return 'TikTok'
  return source
}
