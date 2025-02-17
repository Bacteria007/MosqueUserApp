import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice';
import calendarReducer from '../reducers/calendarSlice';
import notificationReducer from '../reducers/notificationSlice';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['calendar', 'notification'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  calendar: calendarReducer,
  notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
