import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function City() {
  const [buildings, setBuildings] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase.from('buildings').select('*')
    setBuildings(data || [])
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>City Dashboard</h2>
      <p>Total buildings: {buildings.length}</p>
      <ul>
        {buildings.map(b => (
          <li key={b.id}>{b.name} – {b.classification}</li>
        ))}
      </ul>
    </div>
  )
}
