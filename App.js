import React, {useEffect} from 'react';
import {Alert, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {persistor, store} from './src/store/store';
import {STRIPE_PUBLISHABLE_KEY} from '@env';
import Toast from 'react-native-toast-message';
import {PersistGate} from 'redux-persist/integration/react';
import BackgroundFetch from 'react-native-background-fetch';
import {schedulePrayerAlarms} from './src/utils/PrayerAlarm';
import getTodaysPrayers from './src/utils/getTodayPrayers';

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    // Configure BackgroundFetch
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // The interval in minutes (15 minutes is the lowest for iOS)
        stopOnTerminate: false, // Continue running when the app is terminated
        startOnBoot: true, // Start background fetch when the device boots
        enableHeadless: true, // Allows background fetch to work in headless mode
      },
      async taskId => {
        console.log('[BackgroundFetch] Task executed:', taskId);

        // Place your background task here
        performScheduledTask();

        // Finish the task to let the OS know it's complete
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.error('[BackgroundFetch] Failed to start:', error);
      },
    );

    // Start BackgroundFetch service
    BackgroundFetch.start();

    return () => {
      BackgroundFetch.stop();
    };
  }, []);

  const performScheduledTask = () => {
    try {
      console.log(
        '[performScheduledTask] Fetching today’s prayers...',
        new Date().toLocaleTimeString(),
      );
      const prayers = getTodaysPrayers();
      if (prayers) {
        schedulePrayerAlarms(prayers);
        console.log(
          '[performScheduledTask] Prayer alarms scheduled successfully',
        );
      } else {
        console.warn('[performScheduledTask] No prayer times available');
      }
    } catch (error) {
      console.error(
        '[performScheduledTask] Error scheduling prayer alarms:',
        error,
      );
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
