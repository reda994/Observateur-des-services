import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    AppBar, Toolbar, IconButton, Drawer,
    List, ListItem, ListItemIcon, ListItemText, Box,
    useMediaQuery, useTheme, CssBaseline, Tooltip, Badge, Typography
} from '@mui/material';
import { 
    LayoutDashboard, 
    Server, 
    BarChart3, 
    LogOut, 
    Sun, 
    Moon,
    RefreshCw,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu as MenuIcon
} from 'lucide-react';
import { logout } from '../store/authSlice';

const DRAWER_WIDTH = 260;

function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const darkMode = useSelector((state) => state.ui?.darkMode !== false);

    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setDesktopOpen(!desktopOpen);
        }
    };

    const menuItems = [
        { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', 'aria-label': 'Navigate to Dashboard' },
        { text: 'Services', icon: <Server size={20} />, path: '/services', 'aria-label': 'Navigate to Services' },
        { text: 'Statistics', icon: <BarChart3 size={20} />, path: '/statistics', 'aria-label': 'Navigate to Statistics' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const drawer = useMemo(() => (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    component="img"
                    src="/logo-cmr-full.png"
                    alt="CMR Logo"
                    sx={{ 
                        height: 32, 
                        width: 'auto',
                        objectFit: 'contain',
                        display: desktopOpen ? 'block' : 'none'
                    }}
                />
                {desktopOpen && (
                    <Box sx={{ ml: 1 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
                            HealthCheck
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                            Monitor
                        </Typography>
                    </Box>
                )}
            </Box>
            <List sx={{ flex: 1, px: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => navigate(item.path)}
                            aria-label={item['aria-label']}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                px: 2.5,
                                py: 2,
                                backgroundColor: isActive 
                                    ? 'rgba(99, 102, 241, 0.15)' 
                                    : 'transparent',
                                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                                '&:hover': {
                                    backgroundColor: isActive 
                                        ? 'rgba(99, 102, 241, 0.2)' 
                                        : 'rgba(255, 255, 255, 0.05)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#6366f1' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            {desktopOpen && (
                                <ListItemText 
                                    primary={item.text} 
                                    sx={{ 
                                        '& .MuiTypography-root': {
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? '#6366f1' : 'inherit',
                                        }
                                    }}
                                />
                            )}
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{ p: 2 }}>
                <ListItem
                    button
                    onClick={handleLogout}
                    aria-label="Logout"
                    sx={{
                        borderRadius: 2,
                        px: 2.5,
                        py: 2,
                        '&:hover': {
                            backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: '#F87171' }}>
                        <LogOut size={20} />
                    </ListItemIcon>
                    {desktopOpen && (
                        <ListItemText 
                            primary="Logout" 
                            sx={{ '& .MuiTypography-root': { color: '#F87171' } }}
                        />
                    )}
                </ListItem>
            </Box>
        </Box>
    ), [menuItems, navigate, location.pathname, desktopOpen]);

    return (
        <Box sx={{ display: 'flex', bgcolor: darkMode ? '#0B0E14' : '#ffffff' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: desktopOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
                    ml: { md: desktopOpen ? `${DRAWER_WIDTH}px` : 0 },
                    bgcolor: darkMode ? '#0B0E14' : '#ffffff',
                    borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar sx={{ height: 64 }}>
                    <IconButton
                        color="inherit"
                        aria-label="Toggle navigation drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ 
                            mr: 2,
                            color: darkMode ? '#ffffff' : '#0B0E14',
                        }}
                    >
                        {isMobile ? <MenuIcon /> : (desktopOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />)}
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {!isMobile && !desktopOpen && (
                            <Box
                                component="img"
                                src="/logo-cmr-full.png"
                                alt="CMR Logo"
                                sx={{ height: 32, width: 'auto', objectFit: 'contain' }}
                            />
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Refresh">
                            <IconButton
                                color="inherit"
                                aria-label="Refresh"
                                onClick={() => window.location.reload()}
                                sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                            >
                                <RefreshCw size={20} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton
                                color="inherit"
                                aria-label="Notifications"
                                sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                            >
                                <Badge badgeContent={0} color="error">
                                    <Bell size={20} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Settings">
                            <IconButton
                                color="inherit"
                                aria-label="Settings"
                                sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                            >
                                <Settings size={20} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                            <IconButton
                                color="inherit"
                                aria-label="Toggle dark mode"
                                onClick={() => dispatch({ type: 'ui/toggleDarkMode' })}
                                sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ 
                    width: { md: desktopOpen ? DRAWER_WIDTH : 0 }, 
                    flexShrink: { md: 0 },
                    display: { md: desktopOpen ? 'block' : 'none' }
                }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'persistent'}
                    open={isMobile ? mobileOpen : desktopOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: {
                            bgcolor: darkMode ? '#10141C' : '#f8fafc',
                            borderRight: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                        }
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            ...(isMobile && {
                                width: DRAWER_WIDTH,
                            }),
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: desktopOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
                    ml: { md: desktopOpen ? `${DRAWER_WIDTH}px` : 0 },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    bgcolor: darkMode ? '#0B0E14' : '#ffffff',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;