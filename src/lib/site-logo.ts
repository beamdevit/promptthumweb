export type SiteLogoData = {
  src: string
  alt: string
  width?: number
  height?: number
}

export const DEFAULT_SITE_LOGO: SiteLogoData = {
  src: '/assets/logo.png',
  alt: 'Promptthum',
  width: 994,
  height: 285,
}
