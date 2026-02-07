import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import AdminBarChart from '../components/AdminBarChart'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
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

  // --- Aggregations ---
  const cities = [...new Set(buildings.map(b => b.user_id))]
  const totalCities = cities.length
  const totalBuildings = buildings.length
  const totalOccupants = buildings.reduce(
    (sum, b) => sum + (b.occupants || 0),
    0
  )

  // Buildings per city
  const buildingsByCity = Object.values(
    buildings.reduce((acc, b) => {
      acc[b.user_id] = acc[b.user_id] || {
        city: b.user_id.slice(0, 6) + '…',
        buildings: 0,
        occupants: 0,
      }
      acc[b.user_id].buildings += 1
      acc[b.user_id].occupants += b.occupants || 0
      return acc
    }, {})
  )

  return (
    <Layout title="System overview (Admin)">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Cities contributing data"
          value={totalCities}
        />
        <StatCard
          label="Total buildings"
          value={totalBuildings}
        />
        <StatCard
          label="Total occupants (est.)"
          value={totalOccupants}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminBarChart
          title="Buildings per city"
          data={buildingsByCity}
          dataKey="buildings"
        />

        <AdminBarChart
          title="Estimated occupants per city"
          data={buildingsByCity}
          dataKey="occupants"
        />
      </div>

      {/* Table & Export */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            City-level summary
          </h3>

          <button
            onClick={() => {
              const header =
                'city_id,buildings,occupants\n'
              const rows = buildingsByCity
                .map(c =>
                  `${c.city},${c.buildings},${c.occupants}`
                )
                .join('\n')

              const blob = new Blob(
                [header + rows],
                { type: 'text/csv' }
              )
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'admin_city_summary.csv'
              a.click()
            }}
            className="text-sm text-indigo-600 hover:underline"
          >
            Export summary CSV
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-2">City (user)</th>
              <th>Buildings</th>
              <th>Occupants</th>
            </tr>
          </thead>
          <tbody>
            {buildingsByCity.map(c => (
              <tr key={c.city} className="border-b last:border-0">
                <td className="py-2">{c.city}</td>
                <td>{c.buildings}</td>
                <td>{c.occupants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
