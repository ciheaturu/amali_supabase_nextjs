import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          city,
          role: "city"
        }
      }
    })

    if (error) alert(error.message)
    else alert('Signup successful. Check email if confirmation is enabled.')
  }

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user?.user_metadata?.role === "admin") {
      window.location.href = "/admin"
    } else {
      window.location.href = "/city"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div>
        <h1 className="text-3xl font-bold text-indigo-600">
          City Building App
        </h1>

        <input
          placeholder="City name (signup only)"
          onChange={e => setCity(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={signUp}>Sign up</button>
        <button onClick={login}>Login</button>
      </div>
    </div>
  )
}
