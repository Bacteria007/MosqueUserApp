import React, { useEffect } from 'react';
import { Alert, LogBox } from 'react-native';
import notifee from '@notifee/react-native';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store/store';
import { STRIPE_PUBLISHABLE_KEY } from '@env';
import Toast from 'react-native-toast-message';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import BackgroundFetch from 'react-native-background-fetch';
import { scheduleTwoWeeksOfPrayerAlarms, cancelAllScheduledNotifications } from './src/utils/WeeklyAlarms';
import calendarData from './src/calendar.json'; 

LogBox.ignoreAllLogs()
let persistor = persistStore(store);

const App = () => {
  useEffect(() => {
    // Request notification permissions on app start
    async function requestPermissions() {
      const settings = await notifee.requestPermission();
      if (!settings) {
        Alert.alert(
          'Permissions required',
          'Please enable notification permissions in settings.',
        );
      }
    }

    // Call function to schedule initial two weeks of alarms
    async function scheduleInitialAlarms() {
      await cancelAllScheduledNotifications(); // Clear existing notifications
      await scheduleTwoWeeksOfPrayerAlarms(); // Schedule new two-week alarms
    }

    // Initial permission request and alarm scheduling
    requestPermissions();
    scheduleInitialAlarms();

    // Configure BackgroundFetch for rescheduling
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 720, // Interval in minutes (12 hours)
        forceAlarmManager: true,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async taskId => {
        await cancelAllScheduledNotifications(); // Cancel existing notifications
        await scheduleTwoWeeksOfPrayerAlarms(); // Reschedule the next two weeks
        BackgroundFetch.finish(taskId);
      },
      error => console.error('[BackgroundFetch] configure error:', error),
    );

    BackgroundFetch.start(); // Start BackgroundFetch service
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <NavigationContainer>
            <AppNavigator />
            <Toast />
          </NavigationContainer>
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
