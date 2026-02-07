import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function City() {
  const [buildings, setBuildings] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')

    if (!error) setBuildings(data || [])
  }

  // Simple summaries
  const total = buildings.length
  const byType = buildings.reduce((acc, b) => {
    acc[b.classification] = (acc[b.classification] || 0) + 1
    return acc
  }, {})

  const totalOccupants = buildings.reduce(
    (sum, b) => sum + (b.occupants || 0),
    0
  )

  return (
    <div style={{ padding: 40 }}>
      <h2>City Dashboard</h2>

      <p><strong>Total buildings:</strong> {total}</p>
      <p><strong>Total occupants (approx):</strong> {totalOccupants}</p>

      <h3>Buildings by type</h3>
      <ul>
        {Object.entries(byType).map(([type, count]) => (
          <li key={type}>{type}: {count}</li>
        ))}
      </ul>

      <br />
      <a href="/add-building">➕ Add building</a>

      <h3>All buildings</h3>
      <ul>
        {buildings.map(b => (
          <li key={b.id}>
            {b.name} – {b.classification} – {b.occupants || 0} occupants
          </li>
        ))}
      </ul>
    </div>
  )
}
