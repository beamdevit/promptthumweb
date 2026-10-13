import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function aboutParagraphs(paragraphs: string[]): SerializedEditorState {
  return {
    root: {
      type: 'root', version: 1, direction: null, format: '', indent: 0,
      children: paragraphs.map(text => ({
        type: 'paragraph', version: 1, direction: null, format: '', indent: 0,
        children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }],
      })),
    },
  }
}

export function hasAboutContent(value: unknown): boolean {
  if (!value || typeof value !== 'object' || !('root' in value)) return false
  const nodes: unknown[] = [value.root]
  while (nodes.length) {
    const node = nodes.pop()
    if (!node || typeof node !== 'object') continue
    if ('text' in node && typeof node.text === 'string' && node.text.trim()) return true
    if ('children' in node && Array.isArray(node.children)) nodes.push(...node.children)
  }
  return false
}

export const DEFAULT_SITE_ABOUT = {
  eyebrow: 'ABOUT US',
  heading: 'ประวัติบริษัท',
  headingEn: 'Our story',
  content: aboutParagraphs([
    'บริษัท พร้อมพ์ทำ จำกัด ก่อตั้งขึ้นจากความตั้งใจของทีมงานที่ต้องการนำความรู้และประสบการณ์ด้านการออกแบบกราฟิกและการตลาดออนไลน์ มาช่วยให้ธุรกิจสามารถสร้างภาพลักษณ์ที่ดีและสื่อสารกับกลุ่มลูกค้าได้อย่างมีประสิทธิภาพ โดยเฉพาะธุรกิจขนาดเล็กและผู้ที่กำลังเริ่มต้นทำธุรกิจ',
    'ในช่วงเริ่มต้น บริษัทมุ่งเน้นการให้บริการด้านงานออกแบบกราฟิกเป็นหลัก ก่อนที่จะพัฒนาการให้บริการให้ครอบคลุมมากยิ่งขึ้น ทั้งการออกแบบสื่อประชาสัมพันธ์ การออกแบบแบรนด์ดิ้ง การออกแบบเว็บไซต์ การทำคอนเทนต์ และการตลาดออนไลน์ เพื่อให้ลูกค้าสามารถวางแผนและดำเนินงานด้านการสื่อสารการตลาดได้อย่างครบวงจรภายใต้ทีมงานเดียว',
    'ตลอดระยะเวลาการดำเนินงาน เราได้มีโอกาสร่วมงานกับธุรกิจหลากหลายประเภท ทำให้ทีมงานได้เรียนรู้และเข้าใจความต้องการที่แตกต่างกันของแต่ละธุรกิจ และนำประสบการณ์เหล่านั้นมาพัฒนากระบวนการทำงานให้มีความยืดหยุ่น ใส่ใจในรายละเอียด และสามารถออกแบบงานให้เหมาะสมกับเป้าหมายของลูกค้าแต่ละราย',
    'ปัจจุบัน บริษัท พร้อมพ์ทำ จำกัด ยังคงมุ่งมั่นในการพัฒนางานออกแบบและการตลาดออนไลน์อย่างต่อเนื่อง พร้อมนำแนวคิดสร้างสรรค์ เทคโนโลยี และความเข้าใจด้านธุรกิจมาประยุกต์ใช้ในการทำงาน เพื่อสร้างผลงานที่ไม่ได้มุ่งเน้นเพียงความสวยงาม แต่สามารถนำไปใช้งานจริงและช่วยสนับสนุนการเติบโตของธุรกิจได้อย่างเหมาะสม',
    'เราเชื่อว่าการออกแบบที่ดีไม่ควรเป็นเรื่องไกลตัวสำหรับธุรกิจใด ๆ และทุกธุรกิจควรมีโอกาสเข้าถึงงานออกแบบที่มีคุณภาพ เพื่อสร้างความน่าเชื่อถือ สื่อสารตัวตนของแบรนด์ และเติบโตไปพร้อมกับธุรกิจของตนเอง',
  ]),
  contentEn: aboutParagraphs([
    'Promptthum was founded by a team who wanted to use their experience in graphic design and digital marketing to help businesses build a strong identity and connect with their customers, especially small businesses and new entrepreneurs.',
    'We began with graphic design and expanded into advertising, branding, websites, content and digital marketing, bringing complete marketing support together under one team.',
    'Working with many different businesses has helped us understand their individual needs. We use that experience to develop a flexible, detail-focused process built around each client’s goals.',
    'Today, we continue to develop our design and digital marketing services, combining creativity, technology and business understanding to create work that looks good, works in practice and supports business growth.',
    'We believe good design should be accessible to every business, helping brands build trust, express their identity and grow.',
  ]),
}
