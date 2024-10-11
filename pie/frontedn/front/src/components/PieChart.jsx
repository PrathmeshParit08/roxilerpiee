import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components
ChartJS.register(ArcElement, Title, Tooltip, Legend);

const PieChart = ({ data }) => {
  const labels = data.map((item) => item._id);
  const values = data.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Items by Category',
        data: values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF914D', '#9B59B6'],
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
