import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControlLabel, Switch,
    Grid, Alert, Avatar, alpha, useTheme, Fade, Skeleton,
    Card, CardContent, TablePagination, Tooltip
} from '@mui/material';
import {
    Plus, Pencil, Trash2, CheckCircle2, XCircle, AlertTriangle, Wrench,
    Server, Globe, Zap, Clock, Settings, ShieldAlert
} from 'lucide-react';
import { fetchServices, createService, updateService, deleteService } from '../store/servicesSlice';

function Services() {
    const dispatch = useDispatch();
    const { services, loading, error } = useSelector((state) => state.services);
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formData, setFormData] = useState({
        name: '', description: '', url: '', method: 'GET',
        headers: '', body: '', expectedStatusCodes: '200',
        timeout: 30, checkFrequency: 60, latencyThreshold: 2000,
        failureThreshold: 3, keyword: '', alertsEnabled: true,
        maintenance: false, isActive: true
    });

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    const handleOpenDialog = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData(service);
        } else {
            setEditingService(null);
            setFormData({
                name: '', description: '', url: '', method: 'GET',
                headers: '', body: '', expectedStatusCodes: '200',
                timeout: 30, checkFrequency: 60, latencyThreshold: 2000,
                failureThreshold: 3, keyword: '', alertsEnabled: true,
                maintenance: false, isActive: true
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
    };

    const handleSubmit = async () => {
        if (editingService) {
            await dispatch(updateService({ id: editingService.id, data: formData }));
        } else {
            await dispatch(createService(formData));
        }
        handleCloseDialog();
        dispatch(fetchServices());
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce service ?')) {
            await dispatch(deleteService(id));
            dispatch(fetchServices());
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedServices = useMemo(() => {
        return services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [services, page, rowsPerPage]);

    const getStatusConfig = (status) => {
        const config = {
            UP: { label: 'UP', color: theme.palette.success.main, icon: <CheckCircle2 size={18} /> },
            DOWN: { label: 'DOWN', color: theme.palette.error.main, icon: <XCircle size={18} /> },
            DEGRADED: { label: 'DEGRADED', color: theme.palette.warning.main, icon: <AlertTriangle size={18} /> }
        };
        return config[status] || { label: status, color: theme.palette.grey[500], icon: null };
    };

    const ServiceRow = ({ service }) => {
        const statusConfig = getStatusConfig(service.currentStatus);
        const isDown = service.currentStatus === 'DOWN';

        return (
            <TableRow
                sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) }
                }}
            >
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                            p: 1.5, 
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${alpha(statusConfig.color, 0.15)} 0%, ${alpha(statusConfig.color, 0.05)} 100%)`,
                            color: statusConfig.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            {isDown && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -2,
                                        right: -2,
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        bgcolor: statusConfig.color,
                                        animation: 'pulse 2s infinite',
                                        '@keyframes pulse': {
                                            '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                            '50%': { opacity: 0.5, transform: 'scale(1.2)' }
                                        }
                                    }}
                                />
                            )}
                            {statusConfig.icon}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap>
                                {service.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" noWrap>
                                {service.description || 'No description'}
                            </Typography>
                        </Box>
                    </Box>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {service.url}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Chip
                        label={service.method}
                        size="small"
                        variant="outlined"
                        sx={{ 
                            fontSize: '0.7rem',
                            borderRadius: 1,
                            borderColor: alpha(theme.palette.text.secondary, 0.2),
                            color: 'text.secondary'
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={statusConfig.label}
                            size="small"
                            sx={{
                                bgcolor: alpha(statusConfig.color, 0.12),
                                color: statusConfig.color,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                borderRadius: 1,
                                border: `1px solid ${alpha(statusConfig.color, 0.2)}`
                            }}
                        />
                        {service.maintenance && (
                            <Chip
                                label="MAINTENANCE"
                                size="small"
                                icon={<Wrench size={14} />}
                                sx={{
                                    bgcolor: alpha(theme.palette.info.main, 0.12),
                                    color: theme.palette.info.main,
                                    fontSize: '0.7rem',
                                    borderRadius: 1,
                                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                                }}
                            />
                        )}
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Zap size={14} sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" className="tabular-nums">
                            {service.lastResponseTime ? `${service.lastResponseTime}ms` : 'N/A'}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={14} sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" className="tabular-nums">
                            {service.checkFrequency}s
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit service">
                            <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(service)}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }
                                }}
                            >
                                <Pencil size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete service">
                            <IconButton
                                size="small"
                                onClick={() => handleDelete(service.id)}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }
                                }}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Services
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        Manage and monitor your services
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Add Service
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} icon={<ShieldAlert size={20} />}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Service</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>URL</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Method</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Response</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Frequency</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton variant="text" width={150} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={200} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={60} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={80} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={60} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={60} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={80} /></TableCell>
                                    </TableRow>
                                ))
                            ) : services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 12 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Server size={48} sx={{ color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                            <Typography variant="body1" color="textSecondary" mb={2}>
                                                No services configured yet
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Plus size={18} />}
                                                onClick={() => handleOpenDialog()}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Add your first service
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedServices.map((service) => (
                                    <ServiceRow key={service.id} service={service} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={services.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Services per page:"
                />
            </Paper>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Settings size={20} />
                    {editingService ? 'Edit' : 'Add'} Service
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Service Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="URL"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                multiline
                                rows={2}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Select
                                fullWidth
                                value={formData.method}
                                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                size="small"
                            >
                                <MenuItem value="GET">GET</MenuItem>
                                <MenuItem value="POST">POST</MenuItem>
                                <MenuItem value="HEAD">HEAD</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Expected HTTP Codes"
                                value={formData.expectedStatusCodes}
                                onChange={(e) => setFormData({ ...formData, expectedStatusCodes: e.target.value })}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Timeout (s)"
                                value={formData.timeout}
                                onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Check Frequency (s)"
                                value={formData.checkFrequency}
                                onChange={(e) => setFormData({ ...formData, checkFrequency: parseInt(e.target.value) })}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Latency Threshold (ms)"
                                value={formData.latencyThreshold}
                                onChange={(e) => setFormData({ ...formData, latencyThreshold: parseInt(e.target.value) })}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Failure Threshold"
                                value={formData.failureThreshold}
                                onChange={(e) => setFormData({ ...formData, failureThreshold: parseInt(e.target.value) })}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Keyword (optional)"
                                value={formData.keyword}
                                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" flexWrap="wrap" gap={2}>
                                <FormControlLabel
                                    control={<Switch checked={formData.alertsEnabled} onChange={(e) => setFormData({ ...formData, alertsEnabled: e.target.checked })} />}
                                    label="Enable Alerts"
                                />
                                <FormControlLabel
                                    control={<Switch checked={formData.maintenance} onChange={(e) => setFormData({ ...formData, maintenance: e.target.checked })} />}
                                    label="Maintenance Mode"
                                />
                                <FormControlLabel
                                    control={<Switch checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />}
                                    label="Active"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingService ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Services;