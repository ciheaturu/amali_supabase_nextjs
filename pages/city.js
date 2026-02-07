import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import BuildingsByTypeChart from '../components/BuildingsByTypeChart'
import { supabase } from '../lib/supabaseClient'

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
    const { data } = await supabase
      .from('buildings')
      .select('*')

    setBuildings(data || [])
  }

  // --- Metrics ---
  const totalBuildings = buildings.length
  const totalOccupants = buildings.reduce(
    (sum, b) => sum + (b.occupants || 0),
    0
  )

  const missingCoords = buildings.filter(
    b => !b.latitude || !b.longitude
  ).length

  const missingPct =
    totalBuildings === 0
      ? 0
      : Math.round((missingCoords / totalBuildings) * 100)

  // --- Chart data ---
  const byType = Object.values(
    buildings.reduce((acc, b) => {
      acc[b.classification] = acc[b.classification] || {
        type: b.classification,
        count: 0,
      }
      acc[b.classification].count += 1
      return acc
    }, {})
  )

  return (
    <Layout title="City overview">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total buildings"
          value={totalBuildings}
        />
        <StatCard
          label="Total occupants (est.)"
          value={totalOccupants}
        />
        <StatCard
          label="Buildings missing coordinates"
          value={`${missingPct}%`}
          subtitle="Data quality indicator"
        />
      </div>

      {/* Chart + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BuildingsByTypeChart data={byType} />
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Building locations
          </h3>
          <BuildingsMap buildings={buildings} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Building records
          </h3>

          <button
            onClick={() => {
              const header =
                "name,classification,occupants,latitude,longitude\n"
              const rows = buildings
                .map(b =>
                  `${b.name},${b.classification},${b.occupants},${b.latitude},${b.longitude}`
                )
                .join('\n')

              const blob = new Blob([header + rows], {
                type: 'text/csv',
              })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'city_buildings.csv'
              a.click()
            }}
            className="text-sm text-indigo-600 hover:underline"
          >
            Export CSV
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-2">Name</th>
              <th>Type</th>
              <th>Occupants</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map(b => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="py-2">{b.name}</td>
                <td>{b.classification}</td>
                <td>{b.occupants || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
