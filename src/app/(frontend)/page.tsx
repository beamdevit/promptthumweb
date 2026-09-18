import { HomeShowcase } from '@/components/site/HomeShowcase'
import { ContactForm } from '@/components/site/ContactForm'
import { PortfolioCard } from '@/components/site/PortfolioCard'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getFeaturedPortfolio } from '@/lib/portfolio'

// Rendered per request: Railway's private network (and so Postgres) is not
// reachable during the build, so these pages must not be prerendered.
export const dynamic = 'force-dynamic'

const articles = [
  {
    tag: 'บทความ',
    title: 'ผลงานออกแบบโลโก้สำหรับร้านค้า',
    meta: '15 กันยายน 2023',
    tags: ['โลโก้', 'แบรนด์ดิ้ง', 'กราฟิก'],
  },
  {
    tag: 'เทคนิค SEO',
    title: '5 เทคนิค SEO ที่ธุรกิจขนาดเล็กควรรู้',
    meta: 'บทความ · เทคนิค SEO',
    tags: ['seo', 'on-page', 'growth'],
  },
  {
    tag: 'UX/UI',
    title: 'ทำไม UX/UI ที่ดีถึงช่วยเพิ่มยอดขาย',
    meta: 'บทความ · UX/UI',
    tags: ['ux-ui', 'design', 'conversion'],
  },
  {
    tag: 'Ads Banner',
    title: 'เทคนิคทำ Ads Banner ให้คนคลิกจนหยุดไม่ได้',
    meta: 'บทความ · กราฟิกดีไซน์',
    tags: ['ads-banner', 'graphic', 'marketing'],
  },
]

const companyHistory = [
  'บริษัท พร้อมพ์ทำ จำกัด ก่อตั้งขึ้นจากความตั้งใจของทีมงานที่ต้องการนำความรู้และประสบการณ์ด้านการออกแบบกราฟิกและการตลาดออนไลน์ มาช่วยให้ธุรกิจสามารถสร้างภาพลักษณ์ที่ดีและสื่อสารกับกลุ่มลูกค้าได้อย่างมีประสิทธิภาพ โดยเฉพาะธุรกิจขนาดเล็กและผู้ที่กำลังเริ่มต้นทำธุรกิจ',
  'ในช่วงเริ่มต้น บริษัทมุ่งเน้นการให้บริการด้านงานออกแบบกราฟิกเป็นหลัก ก่อนที่จะพัฒนาการให้บริการให้ครอบคลุมมากยิ่งขึ้น ทั้งการออกแบบสื่อประชาสัมพันธ์ การออกแบบแบรนด์ดิ้ง การออกแบบเว็บไซต์ การทำคอนเทนต์ และการตลาดออนไลน์ เพื่อให้ลูกค้าสามารถวางแผนและดำเนินงานด้านการสื่อสารการตลาดได้อย่างครบวงจรภายใต้ทีมงานเดียว',
  'ตลอดระยะเวลาการดำเนินงาน เราได้มีโอกาสร่วมงานกับธุรกิจหลากหลายประเภท ทำให้ทีมงานได้เรียนรู้และเข้าใจความต้องการที่แตกต่างกันของแต่ละธุรกิจ และนำประสบการณ์เหล่านั้นมาพัฒนากระบวนการทำงานให้มีความยืดหยุ่น ใส่ใจในรายละเอียด และสามารถออกแบบงานให้เหมาะสมกับเป้าหมายของลูกค้าแต่ละราย',
  'ปัจจุบัน บริษัท พร้อมพ์ทำ จำกัด ยังคงมุ่งมั่นในการพัฒนางานออกแบบและการตลาดออนไลน์อย่างต่อเนื่อง พร้อมนำแนวคิดสร้างสรรค์ เทคโนโลยี และความเข้าใจด้านธุรกิจมาประยุกต์ใช้ในการทำงาน เพื่อสร้างผลงานที่ไม่ได้มุ่งเน้นเพียงความสวยงาม แต่สามารถนำไปใช้งานจริงและช่วยสนับสนุนการเติบโตของธุรกิจได้อย่างเหมาะสม',
  'เราเชื่อว่าการออกแบบที่ดีไม่ควรเป็นเรื่องไกลตัวสำหรับธุรกิจใด ๆ และทุกธุรกิจควรมีโอกาสเข้าถึงงานออกแบบที่มีคุณภาพ เพื่อสร้างความน่าเชื่อถือ สื่อสารตัวตนของแบรนด์ และเติบโตไปพร้อมกับธุรกิจของตนเอง',
]

const VIDEO_BASE =
  'https://corpusx.bol.co.th/static/corpusx/videos/cpx_website_edit_9feb2026_v2'

export default async function HomePage() {
  const featuredWork = await getFeaturedPortfolio(3)

  return (
    <>
      <SiteHeader />

      <main>
        <section className="hero">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <h1>อย่าให้ไอเดียของคุณอยู่แค่ในความคิด</h1>
              <p className="lede">
                Promptthum ที่นี่เรารับทำเว็บไซต์ที่มีคุณภาพ รองรับ SEO และทุกอุปกรณ์ รวมถึงให้คำปรึกษา
                ออกแบบ UX/UI ปรับแต่ง จนถึงช่วยทำการตลาด กราฟิกดีไซน์ สื่อโซเชียลมีเดียและสื่อสิ่งพิมพ์
                เรียกได้ว่าครบจบในที่เดียว ราคาสบายกระเป๋า ด้วยทีมงานมืออาชีพ
              </p>
              <div className="hero-cta">
                <a className="btn btn-outline" href="#contact">คุยกับทีม</a>
              </div>
            </div>
            <div className="hero-demo-card">
              <div className="hero-demo-band">
                <h3>ตัวอย่างผลงานเว็บไซต์</h3>
                <p>ดูเว็บไซต์ตัวอย่างที่เราออกแบบและพัฒนาจริง</p>
              </div>
              <div className="hero-demo-body">
                <div className="browser-mock">
                  <div className="browser-mock-bar">
                    <span></span>
                    <span></span>
                    <span></span>
                    <div className="browser-mock-url">promptthum.com</div>
                  </div>
                  <div className="browser-mock-body">
                    <video
                      style={{
                        borderRadius: 16,
                        overflow: 'hidden',
                        width: '100%',
                        objectFit: 'cover',
                        objectPosition: '50% 50%',
                      }}
                      disablePictureInPicture
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={`${VIDEO_BASE}/md.mp4`} media="(max-width: 1200px)" type="video/mp4" />
                      <source src={`${VIDEO_BASE}/lg.mp4`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HomeShowcase />



        <section className="about" id="about">
          <div className="wrap">
            <div className="about-card">
              <div className="about-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo.png" alt="Promptthum" />
              </div>
              <div className="about-body">
                <span className="about-eyebrow">ABOUT US</span>
                <h2>ประวัติบริษัท</h2>
                {companyHistory.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {featuredWork.length > 0 && (
          <section className="portfolio" id="portfolio">
            <div className="wrap">
              <div className="section-head">
                <h2>ผลงานที่เลือกมาแล้ว</h2>
                <a className="see-all" href="/portfolio">ดูทั้งหมด →</a>
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
                <h2>บทความ</h2>
                <p className="section-sub">อัปเดตความรู้ด้านการตลาดออนไลน์และงานออกแบบเว็บไซต์</p>
              </div>
              <a className="see-all" href="#articles">ดูทั้งหมด →</a>
            </div>
            <div className="articles-grid">
              {articles.map((article) => (
                <a className="article-card" href="#articles" key={article.title}>
                  <div className="article-thumb">
                    <span className="article-thumb-logo">promptthum</span>
                    <div className="article-thumb-overlay">
                      <span className="article-thumb-tag">{article.tag}</span>
                      <div className="article-thumb-title">{article.title}</div>
                    </div>
                  </div>
                  <div className="article-body">
                    <time>{article.meta}</time>
                    <h3>{article.title}</h3>
                    <div className="article-tags">
                      {article.tags.map((tag) => (
                        <span className="tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                    <span className="read-more">อ่านต่อ →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="wrap contact-inner">
            <div className="contact-form-col">
              <h2>ปรึกษาฟรี ไม่มีค่าใช้จ่าย</h2>
              <p className="section-sub">
                บอกความต้องการและเป้าหมาย เพื่อให้เราช่วยวางแนวทางที่เหมาะกับธุรกิจ ทีมงานติดต่อกลับภายใน 24 ชม.
              </p>
              <ContactForm />
            </div>

            <aside className="contact-side">
              <h3>ติดต่อเรา</h3>
              <div className="cta-band">
                <a className="btn btn-ink btn-sm" href="#contact">แอด LINE</a>
                <a className="btn btn-outline btn-sm" href="tel:+66000000000">โทรเลย</a>
              </div>
              <p className="contact-channels">LINE OA / Facebook / IG / TikTok</p>
              <div className="qr-box placeholder-fill" aria-hidden="true">
                <span>QR LINE</span>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
