import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  Skeleton,
  IconButton
} from '@mui/material';
import {
  RefreshCw,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { fetchStatistics, setPeriod, clearError } from '../store/statisticsSlice';
import AvailabilityChart from '../components/AvailabilityChart';
import LatencyChart from '../components/LatencyChart';
import IncidentsTable from '../components/IncidentsTable';

function Statistics() {
  const dispatch = useDispatch();
  const { data, loading, error, period } = useSelector((state) => state.statistics);

  useEffect(() => {
    dispatch(fetchStatistics(period));
  }, [dispatch, period]);

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod) {
      dispatch(setPeriod(newPeriod));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchStatistics(period));
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BarChart3 size={28} sx={{ color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700}>
            Statistics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={handlePeriodChange}
            size="small"
            sx={{
              bgcolor: 'background.paper',
              '& .MuiToggleButton-root': {
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }
              }
            }}
          >
            <ToggleButton value="24h">24h</ToggleButton>
            <ToggleButton value="7d">7 days</ToggleButton>
            <ToggleButton value="30d">30 days</ToggleButton>
          </ToggleButtonGroup>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={loading} size="small" sx={{ color: 'text.secondary' }}>
              <RefreshCw size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={handleDismissError} sx={{ mb: 3, borderRadius: 2 }} icon={<ShieldAlert size={20} />}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AvailabilityChart data={data} loading={loading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LatencyChart data={data} loading={loading} />
        </Grid>
        <Grid item xs={12}>
          <IncidentsTable incidents={data?.incidents} loading={loading} />
        </Grid>
      </Grid>

      {loading && !data && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
          <Activity size={48} sx={{ color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Box sx={{ ml: 2 }}>
            <Typography color="textSecondary">Loading statistics...</Typography>
          </Box>
        </Box>
      )}

      {!loading && !data && !error && (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 12 }}>
          <TrendingUp size={48} sx={{ color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography color="textSecondary">No data available</Typography>
        </Box>
      )}
    </Box>
  );
}

export default Statistics;
