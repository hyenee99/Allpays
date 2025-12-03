import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface payTypeChartProps {
  data: { payType: string; percentage: number }[];
}
export default function PayTypeChart({ data }: payTypeChartProps) {
  return (
    <BarChart
      width={500}
      height={350}
      layout="vertical"
      data={data}
      margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[0, 100]} unit="%" />
      <YAxis type="category" dataKey="payType" />
      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
      <Bar dataKey="percentage" fill="#ff9a03" />{" "}
    </BarChart>
  );
}
