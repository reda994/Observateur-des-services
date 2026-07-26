import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { AlertTriangle, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';

const IncidentsTable = ({ incidents, loading }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <AlertCircle size={24} sx={{ color: 'error.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Incidents History
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <Typography color="textSecondary">Loading...</Typography>
        </Box>
      </Paper>
    );
  }

  if (!incidents || incidents.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <AlertCircle size={24} sx={{ color: 'error.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Incidents History
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <Typography color="textSecondary">No incidents recorded</Typography>
        </Box>
      </Paper>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime, endTime) => {
    if (!startTime) return 'N/A';
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    if (diffMins > 0) {
      return `${diffMins}min ${diffSecs}s`;
    }
    return `${diffSecs}s`;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AlertCircle size={24} sx={{ color: 'error.main' }} />
        <Typography variant="h6" fontWeight={600}>
          Incidents History
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.error.main, 0.04) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow 
                key={incident.id} 
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                <TableCell sx={{ fontSize: '0.875rem' }}>{formatDate(incident.startedAt)}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{incident.serviceName || 'Unknown'}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  {formatDuration(incident.startedAt, incident.endedAt)}
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{incident.reason || 'Unknown'}</TableCell>
                <TableCell>
                  {incident.endedAt ? (
                    <Chip
                      label="Resolved"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.12),
                        color: theme.palette.success.main,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        borderRadius: 1,
                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                      }}
                      icon={<CheckCircle2 size={14} />}
                    />
                  ) : (
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.12),
                        color: theme.palette.error.main,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        borderRadius: 1,
                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                      }}
                      icon={<XCircle size={14} />}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default IncidentsTable;
