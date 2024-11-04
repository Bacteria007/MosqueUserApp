import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import notifee, {AndroidImportance, TriggerType} from '@notifee/react-native';
import {Provider} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store/store';
import {STRIPE_PUBLISHABLE_KEY} from '@env';
import Toast from 'react-native-toast-message';
import {PersistGate} from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import BackgroundFetch from 'react-native-background-fetch';
import moment from 'moment';
import calendarData from './src/calendar.json';
import {appName} from './src/services/constants';
import { scheduleDailyPrayerAlarms } from './src/utils/NotificationUtils';

let persistor = persistStore(store);

const App = () => {
  useEffect(() => {
    async function requestPermissions() {
      const settings = await notifee.requestPermission();
      if (!settings) {
        Alert.alert(
          'Permissions required',
          'Please enable notification permissions in settings.',
        );
      }
    }

    requestPermissions();

    BackgroundFetch.configure(
      {
        minimumFetchInterval: 720,
        forceAlarmManager: true,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async taskId => {
        await scheduleDailyPrayerAlarms();
        BackgroundFetch.finish(taskId);
      },
      error => console.error('[BackgroundFetch] configure error:', error),
    );

    BackgroundFetch.start();
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
