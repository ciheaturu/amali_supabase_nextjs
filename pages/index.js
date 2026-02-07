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
      options: { data: { city } }
    })
    if (error) alert(error.message)
    else alert('Signup successful. Check email if confirmation is enabled.')
  }

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/city'
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>City Building App</h1>
      <input placeholder="City name (signup only)" onChange={e => setCity(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <br /><br />
      <button onClick={signUp}>Sign up</button>
      <button onClick={login}>Login</button>
    </div>
  )
}
