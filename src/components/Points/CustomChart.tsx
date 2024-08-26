import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { x: 0, y: 1000000 },
  { x: 1, y: 500000 },
  { x: 2, y: 250000 },
  { x: 3, y: 125000 },
  { x: 4, y: 60000 },
  { x: 5, y: 30000 },
  { x: 10, y: 10000 },
  { x: 15, y: 5000 },
  { x: 20, y: 1000 },
  { x: 25, y: 500 },
];

// CustomChart.tsx

const CustomChart: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#262626", border: "2px solid #FF69B4", padding: "8px" }}>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="x" hide />
          <YAxis hide />
          <Line type="monotone" dataKey="y" stroke="#FF69B4" dot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomChart;
