import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  const labels = data.map((item) => item.range);
  const values = data.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Items in Price Range',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">Price Range Distribution</h2>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
