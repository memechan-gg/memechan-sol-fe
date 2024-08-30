import { useTheme } from "next-themes";
import React, { useMemo } from "react";
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

const CustomChart: React.FC = () => {
  const { theme } = useTheme();

  const { backgroundColor, borderColor, lineColor } = useMemo(() => {
    return {
      backgroundColor: theme === "light" ? "#FFFFFF" : "#262626",
      borderColor: theme === "light" ? "#7F0002" : "#FF69B4",
      lineColor: theme === "light" ? "#7F0002" : "#FF69B4",
    };
  }, [theme]);

  return (
    <div style={{ backgroundColor, border: `2px solid ${borderColor}`, padding: "8px" }}>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="x" hide />
          <YAxis hide />
          <Line type="monotone" dataKey="y" stroke={lineColor} dot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomChart;
