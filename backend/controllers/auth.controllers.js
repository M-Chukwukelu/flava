import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { supabaseAdmin }      from '../lib/supabaseAdmin.js'
import { syncSupabaseUser }   from '../utils/syncUser.js'

// Sign up Controller
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email format is invalid." })
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ error: "That username is already taken." })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." })
    }

    const {
      data: { user: supaUser, session },
      error: supaErr
    } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName, username }
      }
    })
    if (supaErr) {
      return res.status(400).json({ error: supaErr.message })
    }

    const mongoUser = await syncSupabaseUser(supaUser)

    res.cookie('jwt', session.access_token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   session.expires_in * 1000
    })

    res.status(201).json({
      _id:        mongoUser._id,
      firstName:  mongoUser.firstName,
      lastName:   mongoUser.lastName,
      username:   mongoUser.username,
      email:      mongoUser.email,
      followers:  mongoUser.followers,
      following:  mongoUser.following,
      profileImg: mongoUser.profileImg,
      coverImg:   mongoUser.coverImg,
    })

  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// Login Controller
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
    let emailForLogin = identifier
    if (!isEmail) {
      const mongoUser = await User.findOne({ username: identifier })
      if (!mongoUser) {
        return res.status(400).json({ error: "Invalid username or password." })
      }
      emailForLogin = mongoUser.email
    }

    const { data: { user: supaUser, session }, error: supaErr } =
      await supabaseAdmin.auth.signInWithPassword({
        email:    emailForLogin,
        password
      })                                                           
    if (supaErr || !session) {
      // e.g. wrong password or no such email
      return res.status(400).json({ error: supaErr?.message || "Invalid username or password." })
    }                                                              

    const mongoUser = await syncSupabaseUser(supaUser)

    res.cookie('jwt', session.access_token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   session.expires_in * 1000
    })

    res.status(200).json({
      _id:        mongoUser._id,
      firstName:  mongoUser.firstName,
      lastName:   mongoUser.lastName,
      username:   mongoUser.username,
      email:      mongoUser.email,
      followers:  mongoUser.followers,
      following:  mongoUser.following,
      profileImg: mongoUser.profileImg,
      coverImg:   mongoUser.coverImg,
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0, httpOnly: true })
    res.status(200).json({ message: "Logged out successfully" })
  } catch (err) {
    console.error("Logout error:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}


// Get Me Controller
export const getMe = (req, res) => {
  // protectRoute already loaded req.user
  res.status(200).json(req.user)
}