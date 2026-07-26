import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, TextField, Button, Typography, Box, Alert
} from '@mui/material';
import { login } from '../store/authSlice';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login({ username, password }));
        if (result.meta.requestStatus === 'fulfilled') {
            navigate('/dashboard');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        HealthCheck Monitor
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login;