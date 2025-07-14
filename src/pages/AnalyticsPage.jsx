import React, { useMemo } from 'react';
import { useCategories } from '../hooks/useCategories';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function AnalyticsPage() {
  const { categories } = useCategories();

  const chartData = useMemo(() => {
    const labels = categories.map(c => c.name);
    const data = categories.map(c => c.transactions.reduce((sum, tx) => sum + parseFloat(tx.nominal), 0));
    
    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
    ];
    
    const borderColors = [
      'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
    ];

    const allTransactions = categories.flatMap(c => c.transactions);
    const timeData = allTransactions.reduce((acc, tx) => {
        const date = new Date(tx.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + parseFloat(tx.nominal);
        return acc;
    }, {});

    const sortedTimeData = Object.entries(timeData).sort((a, b) => new Date(a[0]) - new Date(b[0]));

    return {
      barAndPie: {
        labels,
        datasets: [{
          label: 'Spending by Category',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        }],
      },
      line: {
        labels: sortedTimeData.map(d => d[0]),
        datasets: [{
          label: 'Spending Over Time',
          data: sortedTimeData.map(d => d[1]),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        }],
      }
    };
  }, [categories]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, font: { size: 16 } },
    },
  };

  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold px-4 mb-6">Spending Analytics</h2>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Spending Over Time</h3>
            <div className="h-80">
                <Line data={chartData.line} options={{...options, plugins: {...options.plugins, title: {...options.plugins.title, text: 'Daily Spending'}}}} />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Expenses by Category (Bar)</h3>
            <div className="h-80">
                <Bar data={chartData.barAndPie} options={{...options, plugins: {...options.plugins, title: {...options.plugins.title, text: 'Category Breakdown'}}}} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Expenses by Category (Doughnut)</h3>
            <div className="h-80">
                <Doughnut data={chartData.barAndPie} options={{...options, plugins: {...options.plugins, title: {...options.plugins.title, text: 'Category Proportions'}}}} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AnalyticsPage;
