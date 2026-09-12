import { ContactForm } from '@/components/site/ContactForm'
import { PackageButton } from '@/components/site/PackageButton'
import { SiteHeader } from '@/components/site/SiteHeader'

const INK = '#1c1c1c'

const fitCards = [
  {
    title: 'เปิดร้านใหม่',
    text: 'Landing Page หน้าเดียว พร้อม SEO พื้นฐาน',
    icon: (
      <path
        d="M3 10.5 12 4l9 6.5V19a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
        fill="none"
        stroke={INK}
        strokeWidth="1.5"
      />
    ),
  },
  {
    title: 'ธุรกิจบริการ',
    text: 'เว็บ 3-5 หน้า + ฟอร์มติดต่อ + Blog',
    icon: (
      <path d="M4 6h16M4 12h16M4 18h10" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ),
  },
  {
    title: 'E-commerce',
    text: 'ระบบขายของ CMS จัดการเองได้',
    icon: (
      <>
        <path d="M4 5h16l-1.5 10h-13z" fill="none" stroke={INK} strokeWidth="1.5" />
        <circle cx="9" cy="19" r="1.4" fill={INK} />
        <circle cx="17" cy="19" r="1.4" fill={INK} />
      </>
    ),
  },
  {
    title: 'แบรนด์ใหม่',
    text: 'โลโก้ · CI · Packaging (Pixel Perfect)',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" fill="none" stroke={INK} strokeWidth="1.5" />
        <path d="M12 7v5l3 3" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: 'ทีมการตลาด',
    text: 'Ads Banner · คอนเทนต์ · วีดีโอเอไอ',
    icon: (
      <>
        <path d="M4 19V9l8-5 8 5v10" fill="none" stroke={INK} strokeWidth="1.5" />
        <path d="M9 19v-6h6v6" fill="none" stroke={INK} strokeWidth="1.5" />
      </>
    ),
  },
  {
    title: 'เว็บเดิมเก่าแล้ว',
    text: 'Redesign + เพิ่ม SEO Score',
    icon: (
      <>
        <path d="M4 4h11l5 5v11H4z" fill="none" stroke={INK} strokeWidth="1.5" />
        <path d="M15 4v5h5" fill="none" stroke={INK} strokeWidth="1.5" />
      </>
    ),
  },
]

const services = [
  {
    label: 'WordPress',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" fill="none" stroke={INK} strokeWidth="1.4" />
        <path
          d="M4 10h16M9 3.5c-3 6-3 11 0 17M15 3.5c3 6 3 11 0 17"
          stroke={INK}
          strokeWidth="1.2"
          fill="none"
        />
      </>
    ),
  },
  {
    label: 'UX/UI',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M8 9h8M8 13h5" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'SEO',
    icon: (
      <>
        <circle cx="11" cy="11" r="6" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M20 20l-4.5-4.5" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'โลโก้ / CI',
    icon: (
      <path
        d="M12 4l7 3v5c0 4.5-3 7.5-7 8-4-.5-7-3.5-7-8V7z"
        fill="none"
        stroke={INK}
        strokeWidth="1.4"
      />
    ),
  },
  {
    label: 'Ads Banner',
    icon: (
      <>
        <rect x="3.5" y="7" width="17" height="10" rx="1.5" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M7 11h6" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'วีดีโอเอไอ',
    icon: (
      <>
        <rect x="3.5" y="6" width="13" height="12" rx="1.5" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M16.5 10l4-2.5v9l-4-2.5z" fill="none" stroke={INK} strokeWidth="1.4" />
      </>
    ),
  },
  {
    label: 'Packaging',
    icon: (
      <>
        <path d="M4 8l8-4 8 4-8 4z" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M4 8v8l8 4 8-4V8M12 12v8" fill="none" stroke={INK} strokeWidth="1.4" />
      </>
    ),
  },
  {
    label: 'E-commerce',
    icon: (
      <>
        <path d="M4 5h16l-1.5 10h-13z" fill="none" stroke={INK} strokeWidth="1.4" />
        <circle cx="9" cy="19" r="1.3" fill={INK} />
        <circle cx="17" cy="19" r="1.3" fill={INK} />
      </>
    ),
  },
  {
    label: 'Multi-Language',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" fill="none" stroke={INK} strokeWidth="1.4" />
        <path
          d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"
          stroke={INK}
          strokeWidth="1.2"
          fill="none"
        />
      </>
    ),
  },
  {
    label: 'SSL / Hosting',
    icon: (
      <>
        <rect x="6" y="10.5" width="12" height="8.5" rx="1.5" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke={INK} strokeWidth="1.4" fill="none" />
      </>
    ),
  },
]

const packages = [
  {
    tier: 'pack S',
    amount: '3,000',
    budget: '3000',
    features: 'เว็บหน้าเดียว · UX/UI เบื้องต้น · มือถือ 100% · SEO พื้นฐาน · 2GB · SSL',
    featured: false,
  },
  {
    tier: 'pack M',
    amount: '10,000',
    budget: '10000',
    features: 'เว็บ 3-5 หน้า · UX/UI สวยงาม · On-Page SEO · Blog/Portfolio · ฟอร์ม + Social',
    featured: true,
  },
  {
    tier: 'pack XXL',
    amount: '20,000',
    budget: '20000+',
    features: '5+ หน้า + CMS · UX/UI พรีเมียม Custom · E-commerce/จองคิว · Multi-Language · 1TB',
    featured: false,
  },
]

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

export default function HomePage() {
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
                <a className="btn btn-cta" href="#pricing">เริ่มต้น 3,000฿</a>
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

        <section className="business-fit">
          <div className="wrap">
            <h2>ไม่ว่าธุรกิจคุณแบบไหน… เราช่วยได้</h2>
            <p className="section-sub">
              เลือกสิ่งที่ใกล้เคียงธุรกิจคุณที่สุด แล้วให้เราแนะนำแพ็กเกจที่เหมาะที่สุด
            </p>
            <div className="fit-grid">
              {fitCards.map((card) => (
                <article className="fit-card" key={card.title}>
                  <div className="fit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      {card.icon}
                    </svg>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="services" id="services">
          <div className="wrap">
            <h2>ครบทุกบริการในที่เดียว</h2>
            <p className="section-sub">
              One Stop Service — งานครีเอทีฟและงานเทคนิคทุกอย่างที่ธุรกิจคุณต้องใช้ อยู่ในที่เดียว
            </p>
            <ul className="icon-grid">
              {services.map((service) => (
                <li key={service.label}>
                  <span className="icon-circle" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      {service.icon}
                    </svg>
                  </span>
                  <span>{service.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

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

        <section className="pricing" id="pricing">
          <div className="wrap">
            <h2>แพ็กเกจและโปรโมชั่นทำเว็บไซต์</h2>
            <div className="pricing-grid">
              {packages.map((pkg) => (
                <article
                  className={`price-card${pkg.featured ? ' price-card--featured' : ''}`}
                  key={pkg.tier}
                >
                  <div className="price-tier">
                    {pkg.tier} {pkg.featured && <span className="badge">ยอดนิยม</span>}
                  </div>
                  <div className="price-amount">
                    {pkg.amount}
                    <span>฿</span>
                  </div>
                  <p className="price-features">{pkg.features}</p>
                  <PackageButton
                    budget={pkg.budget}
                    label={`${pkg.tier} — ${pkg.amount}฿`}
                    className={`btn ${pkg.featured ? 'btn-ink' : 'btn-outline'} pkg-btn`}
                  />
                </article>
              ))}
            </div>
            <p className="price-note">ทุกแพ็กเกจปรับแต่งเพิ่มได้ ขึ้นอยู่กับฟังก์ชันที่ต้องการ</p>
          </div>
        </section>

        <section className="portfolio" id="portfolio">
          <div className="wrap">
            <div className="section-head">
              <h2>ผลงานที่เลือกมาแล้ว</h2>
              <a className="see-all" href="#portfolio">ดูทั้งหมด →</a>
            </div>
            <div className="portfolio-grid">
              {['Lookbook โรงแรม', 'ร้านซักผ้า', 'Banner สินค้า'].map((item) => (
                <a className="portfolio-item placeholder-fill" href="#portfolio" key={item}>
                  <span>{item}</span>
                </a>
              ))}
              <a className="portfolio-more" href="#portfolio" aria-label="ดูผลงานเพิ่มเติม">›</a>
            </div>
          </div>
        </section>

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
                บอกงบและเป้าหมาย เราเสนอแพ็กเกจที่เหมาะที่สุด ทีมงานติดต่อกลับภายใน 24 ชม.
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

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div className="footer-brand">Promptthum · รับทำการตลาดออนไลน์ครบวงจร</div>
          <div className="footer-social">
            <a href="#top">FB</a>
            <a href="#top">IG</a>
            <a href="#top">TikTok</a>
            <a href="#top">LINE</a>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <div>Copyright 2026 © Promptthum</div>
          <div className="footer-links">
            <a href="#top">MAIN</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#about">About</a>
            <a href="#articles">Blog</a>
          </div>
        </div>
      </footer>
    </>
  )
}
