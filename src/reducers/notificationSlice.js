// reducers/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isReminderEnabled: false, // Default to false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setReminderEnabled(state, action) {
      state.isReminderEnabled = action.payload;
    },
  },
});

export const { setReminderEnabled } = notificationSlice.actions;
export default notificationSlice.reducer;
