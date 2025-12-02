import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#ff9a03", "#EF4444"]; // 원하는 색상

export default function StatusPieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-60 w-[60%] max-md:w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => `${entry.name} (${entry.value})`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}건`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
