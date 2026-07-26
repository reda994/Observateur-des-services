import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid, Typography, Box, Card, CardContent,
    Chip, Avatar, alpha, useTheme,
    Skeleton, Fade, TextField, InputAdornment, ToggleButton,
    ToggleButtonGroup, Paper, Tooltip, IconButton
} from '@mui/material';
import {
    CheckCircle2, XCircle, AlertTriangle, Zap, Clock,
    TrendingUp, AlertCircle, RefreshCw, Search, Server,
    Activity, Globe, ShieldCheck
} from 'lucide-react';
import { fetchDashboard } from '../store/dashboardSlice';

function Dashboard() {
    const dispatch = useDispatch();
    const { statistics, loading } = useSelector((state) => state.dashboard);
    const theme = useTheme();
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchDashboard());
        const interval = setInterval(() => {
            dispatch(fetchDashboard());
            setLastUpdate(new Date());
        }, 30000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'UP': return <CheckCircle2 size={20} />;
            case 'DOWN': return <XCircle size={20} />;
            case 'DEGRADED': return <AlertTriangle size={20} />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'UP': return theme.palette.success.main;
            case 'DOWN': return theme.palette.error.main;
            case 'DEGRADED': return theme.palette.warning.main;
            default: return theme.palette.grey[500];
        }
    };

    const filteredServices = useMemo(() => {
        if (!statistics?.serviceStatuses) return [];
        
        return statistics.serviceStatuses.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 service.url.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [statistics?.serviceStatuses, searchQuery, statusFilter]);

    const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
        <Fade in={!loading} timeout={500}>
            <Card
                sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
                    border: `1px solid ${alpha(color, 0.15)}`,
                    borderRadius: 3,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
                        borderColor: alpha(color, 0.3)
                    }
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.05)} 100%)`,
                            color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {icon}
                        </Box>
                        {progress !== undefined && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" color="textSecondary" className="tabular-nums">
                                    {progress.toFixed(1)}%
                                </Typography>
                                <TrendingUp size={16} sx={{ color: 'success.main' }} />
                            </Box>
                        )}
                    </Box>
                    <Typography variant="h4" fontWeight={700} color="text.primary" className="tabular-nums">
                        {loading ? <Skeleton width={60} height={40} /> : value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Fade>
    );

    const ServiceCard = ({ service }) => {
        const statusColor = getStatusColor(service.status);
        const isDown = service.status === 'DOWN';
        
        return (
            <Fade in={!loading} timeout={500}>
                <Card
                    sx={{
                        height: '100%',
                        transition: 'all 0.2s ease-in-out',
                        border: `1px solid ${alpha(statusColor, 0.15)}`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 24px ${alpha(statusColor, 0.12)}`,
                            borderColor: alpha(statusColor, 0.3)
                        },
                        '&::before': isDown ? {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `radial-gradient(circle at top right, ${alpha(statusColor, 0.08)} 0%, transparent 60%)`,
                            pointerEvents: 'none'
                        } : {}
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" fontWeight={600} noWrap sx={{ mb: 0.5 }}>
                                    {service.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" noWrap sx={{ display: 'block' }}>
                                    {service.url}
                                </Typography>
                            </Box>
                            <Box sx={{ ml: 2, position: 'relative' }}>
                                {isDown && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -4,
                                            right: -4,
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: statusColor,
                                            animation: 'pulse 2s infinite',
                                            '@keyframes pulse': {
                                                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                                '50%': { opacity: 0.5, transform: 'scale(1.2)' }
                                            }
                                        }}
                                    />
                                )}
                                <Box sx={{ 
                                    p: 1.5, 
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${alpha(statusColor, 0.15)} 0%, ${alpha(statusColor, 0.05)} 100%)`,
                                    color: statusColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {getStatusIcon(service.status)}
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <Chip
                                label={service.status}
                                size="small"
                                sx={{
                                    bgcolor: alpha(statusColor, 0.12),
                                    color: statusColor,
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    borderRadius: 1,
                                    border: `1px solid ${alpha(statusColor, 0.2)}`
                                }}
                            />
                            {service.uptimePercentage !== undefined && (
                                <Chip
                                    label={`${service.uptimePercentage.toFixed(1)}% uptime`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                        fontSize: '0.7rem',
                                        borderRadius: 1,
                                        borderColor: alpha(theme.palette.text.secondary, 0.2),
                                        color: 'text.secondary'
                                    }}
                                />
                            )}
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Zap size={14} sx={{ color: 'text.secondary' }} />
                                    <Typography variant="caption" color="textSecondary" className="tabular-nums">
                                        {service.responseTime || 0}ms
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Clock size={14} sx={{ color: 'text.secondary' }} />
                                    <Typography variant="caption" color="textSecondary">
                                        {service.lastCheckAt || service.lastCheck ? 
                                         new Date(service.lastCheckAt || service.lastCheck).toLocaleTimeString() : 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            {service.failureCount > 0 && (
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                        <AlertCircle size={14} sx={{ color: 'error.main' }} />
                                        <Typography variant="caption" color="error.main">
                                            {service.failureCount} consecutive failure(s)
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            </Fade>
        );
    };

    const handleRefresh = () => {
        dispatch(fetchDashboard());
        setLastUpdate(new Date());
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Dashboard
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        Real-time service monitoring
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Refresh data">
                        <IconButton onClick={handleRefresh} size="small" sx={{ color: 'text.secondary' }}>
                            <RefreshCw size={18} />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" color="textSecondary">
                        Updated {lastUpdate.toLocaleTimeString()}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Services"
                        value={statistics?.totalServices || 0}
                        icon={<Server size={24} />}
                        color="#6366f1"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Operational"
                        value={statistics?.upServices || 0}
                        icon={<CheckCircle2 size={24} />}
                        color="#10B981"
                        progress={statistics?.totalServices ? (statistics.upServices / statistics.totalServices) * 100 : 0}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Down"
                        value={statistics?.downServices || 0}
                        icon={<XCircle size={24} />}
                        color="#F87171"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Global Uptime"
                        value={`${statistics?.globalUptime?.toFixed(1) || 0}%`}
                        icon={<Activity size={24} />}
                        color="#8b5cf6"
                        progress={statistics?.globalUptime || 0}
                    />
                </Grid>
            </Grid>

            <Paper sx={{ p: 3, borderRadius: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Services Status
                    </Typography>
                    <Chip
                        label={`${filteredServices.length} of ${statistics?.serviceStatuses?.length || 0} shown`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                    />
                </Box>

                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <ToggleButtonGroup
                            value={statusFilter}
                            exclusive
                            onChange={(e, newFilter) => setStatusFilter(newFilter || 'all')}
                            size="small"
                            fullWidth
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
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="UP">UP</ToggleButton>
                            <ToggleButton value="DOWN">DOWN</ToggleButton>
                            <ToggleButton value="DEGRADED">Degraded</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Grid item xs={12} sm={6} lg={4} key={i}>
                                <Card sx={{ borderRadius: 3, height: 180 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                                        <Skeleton variant="text" width="40%" height={16} sx={{ mb: 3 }} />
                                        <Skeleton variant="rectangular" width="80%" height={32} sx={{ borderRadius: 1, mb: 2 }} />
                                        <Skeleton variant="rectangular" width="40%" height={20} sx={{ borderRadius: 1 }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : filteredServices.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 12 }}>
                                <Globe size={48} sx={{ color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                <Typography variant="body1" color="textSecondary">
                                    {searchQuery || statusFilter !== 'all' 
                                        ? 'No services match your filters' 
                                        : 'No services configured. Add services to start monitoring.'}
                                </Typography>
                            </Box>
                        </Grid>
                    ) : (
                        filteredServices.map((service) => (
                            <Grid item xs={12} sm={6} lg={4} key={service.id}>
                                <ServiceCard service={service} />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Paper>
        </Box>
    );
}

export default Dashboard;