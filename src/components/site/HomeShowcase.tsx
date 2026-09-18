'use client'

import { SqueezeCarousel, type SqueezeSlide } from '@/components/ui/carousel-squeeze'

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`
const mark = (label: string) => <span style={{ color: '#fff', fontSize: 'clamp(16px, 2cqi, 24px)', fontWeight: 600 }}>{label}</span>
const slides: SqueezeSlide[] = [
  { id: 'website', title: 'เว็บไซต์ที่พร้อมเติบโตไปกับธุรกิจคุณ', description: 'ตั้งแต่หน้าแนะนำธุรกิจไปจนถึงเว็บไซต์ครบวงจร ออกแบบให้ใช้งานง่ายบนทุกอุปกรณ์', image: photo('photo-1460925895917-afdab827c52f'), imageAlt: 'หน้าจอคอมพิวเตอร์แสดงข้อมูลเว็บไซต์', overlay: mark('เว็บไซต์เพื่อธุรกิจ'), action: 'ดูบริการเว็บไซต์', href: '#services' },
  { id: 'design', title: 'ดีไซน์ที่เล่าเรื่องแบรนด์ได้ชัดเจน', description: 'ออกแบบหน้าตาและประสบการณ์ใช้งาน ให้ลูกค้าค้นหาสิ่งที่ต้องการได้ง่าย', image: photo('photo-1558655146-d09347e92766'), imageAlt: 'โต๊ะทำงานออกแบบพร้อมตัวอย่างสีและอุปกรณ์', overlay: mark('UX / UI Design'), action: 'คุยเรื่องงานออกแบบ', href: '#contact' },
  { id: 'marketing', title: 'เชื่อมเว็บไซต์กับการตลาดออนไลน์', description: 'วางแผนเนื้อหาและการนำเสนอ ให้ธุรกิจสื่อสารกับกลุ่มเป้าหมายได้ตรงจุด', image: photo('photo-1460925895917-afdab827c52f'), imageAlt: 'ข้อมูลและกราฟสำหรับวางแผนการตลาด', overlay: mark('Digital Marketing'), action: 'ปรึกษาทีมงาน', href: '#contact' },
  { id: 'brand', title: 'ภาพลักษณ์ที่เป็นตัวคุณในทุกช่องทาง', description: 'กราฟิกและสื่อสำหรับแบรนด์ที่สอดคล้องกัน ทั้งบนเว็บไซต์และโซเชียลมีเดีย', image: photo('photo-1558655146-d09347e92766'), imageAlt: 'ตัวอย่างงานกราฟิกและการเลือกสี', overlay: mark('Brand & Graphic'), action: 'ดูผลงานของเรา', href: '/portfolio' },
  { id: 'team', title: 'มีทีมพร้อมให้คำปรึกษาตลอดทาง', description: 'เริ่มจากทำความเข้าใจธุรกิจของคุณ แล้วเลือกแนวทางและแพ็กเกจที่เหมาะกับงาน', image: photo('photo-1522071820081-009f0129c71c'), imageAlt: 'ทีมงานร่วมกันวางแผนในสำนักงาน', overlay: mark('พร้อมทำไปด้วยกัน'), action: 'เลือกแพ็กเกจ', href: '#pricing' },
]

export function HomeShowcase() {
  return (
    <section className="home-showcase" aria-labelledby="showcase-title">
      <div className="wrap">
        <div className="showcase-heading">
          <p className="showcase-eyebrow">PROMPTTHUM / CREATIVE & DIGITAL</p>
          <h2 id="showcase-title">ไอเดียของคุณ <span>เราพร้อมทำให้เป็นจริง</span></h2>
          <p className="section-sub">เว็บไซต์ ดีไซน์ และการตลาดที่ช่วยให้ธุรกิจของคุณก้าวต่อไป</p>
        </div>
        <SqueezeCarousel slides={slides} label="บริการของ Promptthum" height="clamp(100px, 24cqi, 300px)" gap="clamp(6px, 1.4cqi, 16px)" slatWidth={4} slatGap={4} radius={12} duration={700} accent="var(--brand-blue)" accentForeground="#fff" />
      </div>
    </section>
  )
}
