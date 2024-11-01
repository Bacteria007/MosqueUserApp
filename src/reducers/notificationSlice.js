// reducers/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isReminderEnabled: false, 
  isAutoSilentEnabled:false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setReminderEnabled(state, action) {
      state.isReminderEnabled = action.payload;
    },
    setAutoSilentEnabled(state, action) {
      state.isAutoSilentEnabled = action.payload;
    },
  },
});

export const { setReminderEnabled,setAutoSilentEnabled } = notificationSlice.actions;
export default notificationSlice.reducer;
