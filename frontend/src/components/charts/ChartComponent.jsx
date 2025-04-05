import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

const COLORS = [
  "#0d9488",
  "#0891b2",
  "#0284c7",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#9333ea",
  "#c026d3",
  "#db2777",
  "#e11d48",
]

const ChartComponent = ({
  type = "bar",
  data = [],
  xKey = "name",
  yKey = "value",
  keys = [],
  title = "",
  height = 300,
  colors = COLORS,
  stacked = false,
  horizontal = false,
}) => {
  // Custom tooltip formatter for better mobile experience
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-xs">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
              {`${entry.name}: ${typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Custom legend for better mobile experience
  const CustomLegend = ({ payload }) => {
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-xs">{entry.value}</span>
          </li>
        ))}
      </ul>
    )
  }

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {horizontal ? (
              <>
                <XAxis type="number" />
                <YAxis dataKey={xKey} type="category" width={80} />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
              </>
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {keys.length > 0 ? (
              keys.map((key, index) => (
                <Bar key={key} dataKey={key} stackId={stacked ? "a" : index} fill={colors[index % colors.length]} />
              ))
            ) : (
              <Bar dataKey={yKey} fill={colors[0]} />
            )}
          </BarChart>
        )

      case "line":
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {keys.length > 0 ? (
              keys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))
            ) : (
              <Line type="monotone" dataKey={yKey} stroke={colors[0]} activeDot={{ r: 8 }} strokeWidth={2} />
            )}
          </LineChart>
        )

      case "area":
        return (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {keys.length > 0 ? (
              keys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId={stacked ? "1" : index}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))
            ) : (
              <Area type="monotone" dataKey={yKey} stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
            )}
          </AreaChart>
        )

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yKey}
              nameKey={xKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        )

      default:
        return <div>Chart type not supported</div>
    }
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartComponent

