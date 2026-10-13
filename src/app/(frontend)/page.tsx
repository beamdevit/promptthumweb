import { T } from '@/components/site/SiteLanguage'
import { ArticleCard } from '@/components/site/ArticleCard'
import { getArticles } from '@/lib/articles'
import { getSiteContact } from '@/lib/site-contact'
import { SiteShowreel } from '@/components/site/SiteShowreel'
import { getSiteVideo } from '@/lib/site-video'
import { HomeShowcase } from '@/components/site/HomeShowcase'
import { ContactForm } from '@/components/site/ContactForm'
import { PortfolioCard } from '@/components/site/PortfolioCard'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { AboutSection } from '@/components/site/AboutSection'
import { getSiteAbout } from '@/lib/site-about'
import { getFeaturedPortfolio } from '@/lib/portfolio'

// Rendered per request: Railway's private network (and so Postgres) is not
// reachable during the build, so these pages must not be prerendered.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featuredWork, video, articles, contact, about] = await Promise.all([getFeaturedPortfolio(3), getSiteVideo(), getArticles(1, 4), getSiteContact(), getSiteAbout()])

  return (
    <>
      <SiteHeader />

      <main>
        <section className="hero">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <h1><T>อย่าให้ไอเดียของคุณอยู่แค่ในความคิด</T></h1>
              <p className="lede"><T>Promptthum ที่นี่เรารับทำเว็บไซต์ที่มีคุณภาพ รองรับ SEO และทุกอุปกรณ์ รวมถึงให้คำปรึกษา ออกแบบ UX/UI ปรับแต่ง จนถึงช่วยทำการตลาด กราฟิกดีไซน์ สื่อโซเชียลมีเดียและสื่อสิ่งพิมพ์ เรียกได้ว่าครบจบในที่เดียว ราคาสบายกระเป๋า ด้วยทีมงานมืออาชีพ</T></p>
              <div className="hero-cta">
                <a className="btn btn-outline" href="#contact"><T>คุยกับทีม</T></a>
              </div>
            </div>
            <SiteShowreel {...video} />
          </div>
        </section>

        <HomeShowcase />
        <AboutSection about={about} />

        {featuredWork.length > 0 && (
          <section className="portfolio" id="portfolio">
            <div className="wrap">
              <div className="section-head">
                <h2><T>ผลงานที่เลือกมาแล้ว</T></h2>
                <a className="see-all" href="/portfolio"><T>ดูทั้งหมด →</T></a>
              </div>
              <div className="work-grid">
                {featuredWork.map((item) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="articles" id="articles">
          <div className="wrap">
            <div className="section-head">
              <div>
                <h2><T>บทความ</T></h2>
                <p className="section-sub"><T>อัปเดตความรู้ด้านการตลาดออนไลน์และงานออกแบบเว็บไซต์</T></p>
              </div>
              <a className="see-all" href="/articles"><T>ดูทั้งหมด →</T></a>
            </div>
            {articles.docs.length === 0 && <p className="articles-empty"><T>เตรียมพบกับบทความและไอเดียใหม่ ๆ จาก Promptthum</T></p>}
            <div className="articles-grid">
              {articles.docs.map(article => <ArticleCard key={article.id} article={article} />)}
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="wrap contact-inner">
            <div className="contact-form-col">
              <h2><T>ปรึกษาฟรี ไม่มีค่าใช้จ่าย</T></h2>
              <p className="section-sub"><T>บอกความต้องการและเป้าหมาย เพื่อให้เราช่วยวางแนวทางที่เหมาะกับธุรกิจ ทีมงานติดต่อกลับภายใน 24 ชม.</T></p>
              <ContactForm />
            </div>

            <aside className="contact-side">
              <h3><T>ติดต่อเรา</T></h3>
              <div className="cta-band">
                {contact.lineUrl && <a className="btn btn-ink btn-sm" href={contact.lineUrl} target="_blank" rel="noopener noreferrer"><T>แอด LINE</T></a>}
                <a className="btn btn-outline btn-sm" href="tel:+66000000000"><T>โทรเลย</T></a>
              </div>
              <p className="contact-channels">LINE OA / Facebook / IG / TikTok</p>
              {contact.qr?.url && <figure className="contact-line-qr">
                <img src={contact.qr.url} alt={contact.qr.alt || 'QR Code เพิ่มเพื่อน LINE ของ Promptthum'} loading="lazy" />
                <figcaption><T>สแกนเพื่อเพิ่มเพื่อนบน LINE</T></figcaption>
              </figure>}
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
