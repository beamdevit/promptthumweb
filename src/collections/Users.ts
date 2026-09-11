import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'ผู้ใช้', plural: 'ผู้ใช้' },
  auth: true,
  admin: {
    group: 'System',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => Boolean(req.user),
    update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'ชื่อ' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: 'สิทธิ์',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only an admin may change roles, so an editor cannot promote itself.
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}
