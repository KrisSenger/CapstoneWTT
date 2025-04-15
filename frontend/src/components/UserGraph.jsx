import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import api from '../api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import LoadingCircle from './LoadingCircle';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserGraph = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/user/data/');
        const users = response.data;

        const activeCount = users.filter(user => user.is_active).length;
        const inactiveCount = users.filter(user => !user.is_active).length;

        setChartData({
          labels: ['Active Users', 'Inactive Users'],
          datasets: [
            {
              data: [activeCount, inactiveCount],
              backgroundColor: ['#28a745', '#dc3545'], // Green for active, red for inactive
              hoverBackgroundColor: ['#28a745', '#dc3545']
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching user data for pie chart: ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ width: '300px', height: '300px' }}>
      {chartData ? (
        <Pie
          data={chartData}
          options={{
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Active User Status' }
            }
          }}
          width={300}
          height={300}
        />
      ) : (
        <p><LoadingCircle/></p>
      )}
    </div>
  );
};

export default UserGraph;
