import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({title,labels,values,label}) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
  const data = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: values,
        backgroundColor: [
            ' #FF5A5F',

            '#4cceac',
            '#6870fa',
        ],
        borderColor: [
          'white'
        ],
        borderWidth: 2,
      },
    ],
  };
  return <Pie data={data} options={options} />
}

export default PieChart