import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import LoadingCircle from './LoadingCircle';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LogsBarGraph = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/log/fivedata/');
        const logs = response.data;

        // Compute your x-axis labels (last 5 days) and counts
        const today = new Date();
        const days = [];
        for (let i = 4; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          days.push(d.toLocaleDateString('en-US'));
        }

        const counts = days.map(() => 0);
        logs.forEach(log => {
          const logDate = new Date(log.date).toLocaleDateString('en-US');
          const index = days.indexOf(logDate);
          if (index !== -1) counts[index]++;
        });

        setChartData({
          labels: days,
          datasets: [
            {
              label: 'Logs Count',
              data: counts,
              backgroundColor: 'rgba(243, 130, 38, 0.6)',
              hoverBackgroundColor: 'rgba(243, 130, 38, 0.8)'
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching logs for bar graph:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '400px', height: '300px' }}>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Logs totals for the Last 5 Days' },
            },
          }}
          width={400}
          height={300}
        />
      ) : (
        <p><LoadingCircle/></p>
      )}
    </div>
  );
};

export default LogsBarGraph;
