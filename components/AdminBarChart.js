import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function AdminBarChart({ title, data, dataKey }) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm h-64">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="city" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#1f2937" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
