import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice';
import calendarReducer from '../reducers/calendarSlice';
// import logger from 'redux-logger'; // Importing redux-logger

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar:calendarReducer
  },
  // Adding middleware
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
