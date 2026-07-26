import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        darkMode: false,
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },
    },
});

export const { toggleDarkMode, setDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
