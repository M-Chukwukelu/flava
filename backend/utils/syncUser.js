// server/utils/syncUser.js
import User from '../models/user.models.js'

export async function syncSupabaseUser(supaUser) {
  const meta = supaUser.user_metadata || {}

  const rawName =
    meta.firstName && meta.lastName
      ? `${meta.firstName} ${meta.lastName}`
      : meta.full_name       
      || meta.name
      || supaUser.email
      .split('@')[0]

  const parts = rawName.trim().split(/\s+/)
  const firstName = meta.firstName || parts[0]
  const lastName  = meta.lastName  || parts.slice(1).join(' ') || ''

  const base =
    meta.username ||
    rawName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 20)
      || `user${Date.now().toString(36)}`

  let username = base
  let suffix   = 1
  while (await User.exists({ username })) {
    username = base + suffix++
  }

  const mongoUser = await User.findOneAndUpdate(
    { supabaseId: supaUser.id },
    {
      $setOnInsert: {
        supabaseId: supaUser.id,
        email: supaUser.email,
        username,
        firstName,
        lastName,
        profileName: username,
      }
    },
    { upsert: true, new: true, runValidators: true }
  )

  return mongoUser
}
