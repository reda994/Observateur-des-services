import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchStatistics = createAsyncThunk(
  'statistics/fetch',
  async (period = '24h', { rejectWithValue }) => {
    try {
      const response = await api.get(`/dashboard/statistics?period=${period}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch statistics');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  period: '24h',
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPeriod, clearError } = statisticsSlice.actions;
export default statisticsSlice.reducer;
