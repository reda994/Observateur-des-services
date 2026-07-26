
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import servicesReducer from './servicesSlice';
import dashboardReducer from './dashboardSlice';
import uiReducer from './uiSlice';
import statisticsReducer from './statisticsSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        services: servicesReducer,
        dashboard: dashboardReducer,
        ui: uiReducer,
        statistics: statisticsReducer,
    },
});