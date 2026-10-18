import type { CollectionConfig } from 'payload'

import { hiddenFromEditors, isAdmin, isAdminField, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Settings',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    hidden: hiddenFromEditors,
  },
  auth: true,
  access: {
    // The first user is created through /admin's register screen, which bypasses access.
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only admins can promote or demote users.
        update: isAdminField,
      },
      admin: {
        description: 'Editors manage site content. Admins also manage users.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      // The first account created through /admin becomes the admin.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        return totalDocs === 0 ? { ...data, role: 'admin' } : data
      },
    ],
  },
}
