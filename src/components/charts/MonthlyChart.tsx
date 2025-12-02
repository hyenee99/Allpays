import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface MonthlyChartProps {
  data: { date: string; total: number }[];
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => value.toLocaleString()} />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#ff9a03"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
