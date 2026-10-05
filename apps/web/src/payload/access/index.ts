import type { Access, ClientUser, FieldAccess, PayloadRequest } from 'payload'

type User = PayloadRequest['user']

export const isAdminUser = (user: User) => user?.role === 'admin'

/** Public read. */
export const anyone: Access = () => true

/** Never via the API. Server code uses the Local API with `overrideAccess: true`. */
export const nobody: Access = () => false

/** Any logged-in user (admin or editor). */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const isAdmin: Access = ({ req: { user } }) => isAdminUser(user)

export const isAdminField: FieldAccess = ({ req: { user } }) => isAdminUser(user)

/** Admins see every user; everyone else only themselves. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdminUser(user)) return true
  return { id: { equals: user.id } }
}

/** Logged-in users see drafts; the public only sees published documents. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

/** For `admin.hidden`: hide admin-only collections from editors. `role` is in the JWT. */
export const hiddenFromEditors = ({ user }: { user: ClientUser | User }) =>
  (user as { role?: string } | null)?.role !== 'admin'
