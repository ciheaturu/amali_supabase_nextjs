import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Load the map component client‑side only
const BuildingsMap = dynamic(
  () => import('../components/BuildingsMap'),
  { ssr: false }
)

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

  // Summaries
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

      {/* MAP SECTION */}
      <h3>Building locations</h3>
      <BuildingsMap buildings={buildings} />

      {/* EXPORT BUTTON */}
      <button
        onClick={() => {
          const header = "name,classification,occupants,latitude,longitude\n"
          const rows = buildings.map(b =>
            `${b.name},${b.classification},${b.occupants},${b.latitude},${b.longitude}`
          ).join("\n")

          const blob = new Blob([header + rows], { type: "text/csv" })
          const url = URL.createObjectURL(blob)

          const a = document.createElement("a")
          a.href = url
          a.download = "city_buildings.csv"
          a.click()
        }}
      >
        ⬇ Export CSV
      </button>

      <br /><br />
      <a href="/add-building">➕ Add building</a>

      <h3>Buildings by type</h3>
      <ul>
        {Object.entries(byType).map(([type, count]) => (
          <li key={type}>{type}: {count}</li>
        ))}
      </ul>

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
