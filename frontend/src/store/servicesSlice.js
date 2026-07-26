import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchServices = createAsyncThunk('services/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/services');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const createService = createAsyncThunk('services/create', async (data, { rejectWithValue }) => {
    try {
        const response = await api.post('/services', data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const updateService = createAsyncThunk('services/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/services/${id}`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const deleteService = createAsyncThunk('services/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/services/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

const initialState = {
    services: [],
    loading: false,
    error: null,
};

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.services.push(action.payload);
            })
            .addCase(updateService.fulfilled, (state, action) => {
                const index = state.services.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.services[index] = action.payload;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.services = state.services.filter(s => s.id !== action.payload);
            });
    },
});

export default servicesSlice.reducer;