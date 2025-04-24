import 'dotenv/config'
import mongoose from 'mongoose'
import { supabaseAdmin } from '../backend/lib/supabaseAdmin.js'
import User from '../backend/models/user.models.js'

async function main() {
  await mongoose.connect(process.env.MONGO_URI)
  const users = await User.find({ supabaseId: null })

  for (const u of users) {
    try {
      // Look up the Supabase user by email:
      const { data: { user: supaUser }, error } =
        await supabaseAdmin.auth.getUserByEmail(u.email)

      if (error) {
        console.warn(`No Supa user for ${u.email}:`, error.message)
        continue
      }

      u.supabaseId = supaUser.id
      await u.save()
      console.log(`Mapped ${u.email} → ${supaUser.id}`)
    } catch (err) {
      console.error(`Error for ${u.email}:`, err.message)
    }
  }

  console.log('Migration complete.')
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
