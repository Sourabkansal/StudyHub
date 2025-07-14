import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartBarMultiple = ({ chartsdata }) => {
  // Format the data to ensure clean decimal values (1 decimal place)
  const formattedData = chartsdata.map(item => ({
    ...item,
    ReadingHours: parseFloat(item.ReadingHours.toFixed(1)),
    LearningHours: parseFloat(item.LearningHours.toFixed(1))
  }));

  // Custom tooltip formatter
  const formatTooltipValue = (value) => {
    return `${value.toFixed(1)} hrs`;
  };

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-[700px]">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold">Weekly Reading vs Learning</h2>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="dayName" tick={false} axisLine={false} />
            <YAxis
              ticks={[0.1, 0.5, 1, 2, 3]}  // Adjusted for hourly values
              axisLine={true}
              tickLine={false}
              width={30}
              tickFormatter={(value) => value.toFixed(1)}  // Format Y-axis labels
            />
            <Tooltip 
              formatter={formatTooltipValue}  // Format tooltip values
              labelFormatter={(label) => label}
            />
            <Legend />
            <Bar dataKey="ReadingHours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="LearningHours" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartBarMultiple;