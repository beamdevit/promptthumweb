import { RichText } from '@payloadcms/richtext-lexical/react'
import { LocalizedContent, T } from './SiteLanguage'
import { AboutImage } from './AboutImage'
import type { SiteAboutData } from '@/lib/site-about'

export function AboutSection({ about }: { about: SiteAboutData }) {
  return <section className="about" id="about" aria-labelledby="about-heading">
    <div className="wrap">
      <div className="about-card">
        <div className="about-logo"><AboutImage image={about.image} /></div>
        <div className="about-body">
          {about.eyebrow && <span className="about-eyebrow">{about.eyebrow}</span>}
          <h2 id="about-heading"><T en={about.headingEn}>{about.heading}</T></h2>
          <div className="about-content">
            <LocalizedContent
              th={<RichText data={about.content} />}
              en={<RichText data={about.contentEn} />}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
}
