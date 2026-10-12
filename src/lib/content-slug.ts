export function contentSlug(value: unknown, maxLength = 120): string {
  return typeof value === 'string'
    ? value
        .normalize('NFC')
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, maxLength)
        .replace(/^-+|-+$/g, '')
    : ''
}
