import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Statistics from './pages/Statistics';

function AppContent() {
    const darkMode = useSelector((state) => state.ui?.darkMode !== false); // Default to dark mode

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    primary: { main: '#6366f1' },
                    secondary: { main: '#8b5cf6' },
                    success: { main: '#10B981' },
                    error: { main: '#F87171' },
                    warning: { main: '#FBBF24' },
                    background: {
                        default: darkMode ? '#0B0E14' : '#ffffff',
                        paper: darkMode ? '#151A23' : '#ffffff',
                    },
                    text: {
                        primary: darkMode ? '#ffffff' : '#0B0E14',
                        secondary: darkMode ? '#94a3b8' : '#64748b',
                    },
                },
                typography: {
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    h1: { fontWeight: 700 },
                    h2: { fontWeight: 600 },
                    h3: { fontWeight: 600 },
                    h4: { fontWeight: 600 },
                    h5: { fontWeight: 600 },
                    h6: { fontWeight: 600 },
                },
                shape: {
                    borderRadius: 12,
                },
                components: {
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 16,
                                boxShadow: darkMode 
                                    ? '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)' 
                                    : '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                                border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: darkMode 
                                        ? '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)' 
                                        : '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                },
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                textTransform: 'none',
                                fontWeight: 500,
                            },
                        },
                    },
                },
            }),
        [darkMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<PrivateRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/statistics" element={<Statistics />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? 'dark' : 'light'} />
        </ThemeProvider>
    );
}

function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;