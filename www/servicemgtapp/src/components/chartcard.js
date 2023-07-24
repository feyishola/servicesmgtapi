import React from "react";
import { Card, CardContent } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"; // Import the necessary components from recharts

const ChartCard = ({ chartData, chartColor, statIcon, statText }) => {
  return (
    <Card>
      <CardContent>
        <LineChart width={200} height={100} data={chartData}>
          <XAxis dataKey="x" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke={chartColor} />
        </LineChart>
        <div>
          <span>{statIcon}</span>
          <span>{statText}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
