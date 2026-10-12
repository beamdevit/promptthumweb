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
import { SiteLogo } from '@/components/site/SiteLogo'
import { getFeaturedPortfolio } from '@/lib/portfolio'

// Rendered per request: Railway's private network (and so Postgres) is not
// reachable during the build, so these pages must not be prerendered.
export const dynamic = 'force-dynamic'

const companyHistory = [
  'บริษัท พร้อมพ์ทำ จำกัด ก่อตั้งขึ้นจากความตั้งใจของทีมงานที่ต้องการนำความรู้และประสบการณ์ด้านการออกแบบกราฟิกและการตลาดออนไลน์ มาช่วยให้ธุรกิจสามารถสร้างภาพลักษณ์ที่ดีและสื่อสารกับกลุ่มลูกค้าได้อย่างมีประสิทธิภาพ โดยเฉพาะธุรกิจขนาดเล็กและผู้ที่กำลังเริ่มต้นทำธุรกิจ',
  'ในช่วงเริ่มต้น บริษัทมุ่งเน้นการให้บริการด้านงานออกแบบกราฟิกเป็นหลัก ก่อนที่จะพัฒนาการให้บริการให้ครอบคลุมมากยิ่งขึ้น ทั้งการออกแบบสื่อประชาสัมพันธ์ การออกแบบแบรนด์ดิ้ง การออกแบบเว็บไซต์ การทำคอนเทนต์ และการตลาดออนไลน์ เพื่อให้ลูกค้าสามารถวางแผนและดำเนินงานด้านการสื่อสารการตลาดได้อย่างครบวงจรภายใต้ทีมงานเดียว',
  'ตลอดระยะเวลาการดำเนินงาน เราได้มีโอกาสร่วมงานกับธุรกิจหลากหลายประเภท ทำให้ทีมงานได้เรียนรู้และเข้าใจความต้องการที่แตกต่างกันของแต่ละธุรกิจ และนำประสบการณ์เหล่านั้นมาพัฒนากระบวนการทำงานให้มีความยืดหยุ่น ใส่ใจในรายละเอียด และสามารถออกแบบงานให้เหมาะสมกับเป้าหมายของลูกค้าแต่ละราย',
  'ปัจจุบัน บริษัท พร้อมพ์ทำ จำกัด ยังคงมุ่งมั่นในการพัฒนางานออกแบบและการตลาดออนไลน์อย่างต่อเนื่อง พร้อมนำแนวคิดสร้างสรรค์ เทคโนโลยี และความเข้าใจด้านธุรกิจมาประยุกต์ใช้ในการทำงาน เพื่อสร้างผลงานที่ไม่ได้มุ่งเน้นเพียงความสวยงาม แต่สามารถนำไปใช้งานจริงและช่วยสนับสนุนการเติบโตของธุรกิจได้อย่างเหมาะสม',
  'เราเชื่อว่าการออกแบบที่ดีไม่ควรเป็นเรื่องไกลตัวสำหรับธุรกิจใด ๆ และทุกธุรกิจควรมีโอกาสเข้าถึงงานออกแบบที่มีคุณภาพ เพื่อสร้างความน่าเชื่อถือ สื่อสารตัวตนของแบรนด์ และเติบโตไปพร้อมกับธุรกิจของตนเอง',
]



const companyHistoryEn = [
  "Promptthum was founded by a team who wanted to use their experience in graphic design and digital marketing to help businesses build a strong identity and connect with their customers, especially small businesses and new entrepreneurs.",
  "We began with graphic design and expanded into advertising, branding, websites, content and digital marketing, bringing complete marketing support together under one team.",
  "Working with many different businesses has helped us understand their individual needs. We use that experience to develop a flexible, detail-focused process built around each client’s goals.",
  "Today, we continue to develop our design and digital marketing services, combining creativity, technology and business understanding to create work that looks good, works in practice and supports business growth.",
  "We believe good design should be accessible to every business, helping brands build trust, express their identity and grow."
]

export default async function HomePage() {
  const [featuredWork, video, articles, contact] = await Promise.all([getFeaturedPortfolio(3), getSiteVideo(), getArticles(1, 4), getSiteContact()])

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



        <section className="about" id="about">
          <div className="wrap">
            <div className="about-card">
              <div className="about-logo">
                <SiteLogo />
              </div>
              <div className="about-body">
                <span className="about-eyebrow">ABOUT US</span>
                <h2><T>ประวัติบริษัท</T></h2>
                {companyHistory.map((paragraph, index) => (
                  <p key={index}><T en={companyHistoryEn[index]}>{paragraph}</T></p>
                ))}
              </div>
            </div>
          </div>
        </section>

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
