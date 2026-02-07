import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function BuildingsByTypeChart({ data }) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm h-64">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Buildings by type
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
