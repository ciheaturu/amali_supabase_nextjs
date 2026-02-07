import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
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

  const byCity = buildings.reduce((acc, b) => {
    acc[b.user_id] = (acc[b.user_id] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Dashboard</h2>

      <p><strong>Total buildings (all cities):</strong> {buildings.length}</p>

      <h3>Buildings per city (by user)</h3>
      <ul>
        {Object.entries(byCity).map(([city, count]) => (
          <li key={city}>{city}: {count}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          const header = "city_id,name,classification,occupants\n"
          const rows = buildings.map(b =>
            `${b.user_id},${b.name},${b.classification},${b.occupants}`
          ).join("\n")

          const blob = new Blob([header + rows], { type: "text/csv" })
          const url = URL.createObjectURL(blob)

          const a = document.createElement("a")
          a.href = url
          a.download = "all_cities_buildings.csv"
          a.click()
        }}
      >
        ⬇ Export ALL data (CSV)
      </button>
    </div>
  )
}
