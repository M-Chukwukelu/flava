// server/utils/syncUser.js
import User from '../models/user.models.js'

export async function syncSupabaseUser(supaUser) {
  let mongoUser = await User.findOne({ supabaseId: supaUser.id })
  if (!mongoUser) {
    mongoUser = await User.create({
      supabaseId: supaUser.id,
      email:      supaUser.email,
      // you can pull in metadata if you set it on signup:
      firstName:  supaUser.user_metadata.firstName,
      lastName:   supaUser.user_metadata.lastName,
      username:   supaUser.user_metadata.username,
    })
  }
  return mongoUser
}
