import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Box, Card, CardContent, Typography, CircularProgress, useTheme } from '@mui/material';
import { Zap } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LatencyChart = ({ data, loading }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Zap size={24} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Latency Trend
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.responseTimes || !data.labels) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Zap size={24} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Latency Trend
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography color="textSecondary">No data available</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: data.responseTimes,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: isDark ? '#0B0E14' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(21, 26, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#fff' : '#0B0E14',
        bodyColor: isDark ? '#94a3b8' : '#64748b',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}ms`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => value + 'ms',
          color: isDark ? '#94a3b8' : '#64748b',
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Zap size={24} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Latency Trend
          </Typography>
        </Box>
        <Box sx={{ height: 300 }}>
          <Line data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default LatencyChart;
