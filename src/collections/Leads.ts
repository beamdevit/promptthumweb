import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'ข้อความติดต่อ', plural: 'ข้อความติดต่อ' },
  admin: {
    group: 'Lead Management',
    useAsTitle: 'name',
    defaultColumns: ['name', 'contact', 'status', 'createdAt'],
  },
  access: {
    // Leads arrive through the public contact endpoint, which creates them with
    // overrideAccess. Nobody may create, edit or read them without logging in.
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'ชื่อ' },
        { name: 'contact', type: 'text', required: true, label: 'อีเมล / เบอร์โทร' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'budget',
          type: 'select',
          label: 'งบประมาณ (ข้อมูลเดิม)',
          admin: { hidden: true },
          options: [
            { label: '3,000', value: '3000' },
            { label: '10,000', value: '10000' },
            { label: '20,000+', value: '20000+' },
            { label: 'ไม่ระบุ', value: 'unspecified' },
          ],
          defaultValue: 'unspecified',
        },
        { name: 'packageInterest', type: 'text', label: 'แพ็กเกจที่สนใจ (ข้อมูลเดิม)', admin: { hidden: true } },
      ],
    },
    { name: 'message', type: 'textarea', label: 'รายละเอียดงาน' },
    {
      name: 'status',
      type: 'select',
      label: 'สถานะ',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'ใหม่', value: 'new' },
        { label: 'กำลังติดต่อ', value: 'contacting' },
        { label: 'เสนอราคาแล้ว', value: 'quoted' },
        { label: 'ปิดการขาย', value: 'won' },
        { label: 'ไม่สนใจ', value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
      label: 'ผู้รับผิดชอบ',
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'array',
      label: 'บันทึกการติดตาม',
      fields: [
        { name: 'note', type: 'textarea', required: true, label: 'บันทึก' },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          label: 'ผู้บันทึก',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'ที่มา',
      admin: { initCollapsed: true },
      fields: [
        { name: 'sourcePage', type: 'text', label: 'หน้าที่ส่งฟอร์ม' },
        { name: 'referrer', type: 'text', label: 'Referrer' },
        { name: 'utmSource', type: 'text', label: 'utm_source' },
        { name: 'utmMedium', type: 'text', label: 'utm_medium' },
        { name: 'utmCampaign', type: 'text', label: 'utm_campaign' },
      ],
    },
  ],
  timestamps: true,
}
