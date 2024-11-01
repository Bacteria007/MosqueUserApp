import React, {useEffect} from 'react';
import {Alert, LogBox, Platform, ToastAndroid} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {Provider} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
import {NavigationContainer} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store/store';
import {STRIPE_PUBLISHABLE_KEY} from '@env';
import Toast from 'react-native-toast-message';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';


let persistor = persistStore(store)
LogBox.ignoreAllLogs(true);
const App = () => {
  useEffect(() => {
    console.log('Configuring notifications...');
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION RECEIVED:', notification);
      },
      requestPermissions: Platform.OS == 'ios',
    });

    checkAndRequestNotificationPermission();
  }, []);

  const checkAndRequestNotificationPermission = async () => {
    // console.log('uuuuuuuuuu');

    const permission =
      Platform.OS == 'android'
        ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
        : PERMISSIONS.IOS.NOTIFICATIONS;

    try {
      const result = await check(permission);
      if (result == RESULTS.GRANTED) {
        console.log(result);

        console.log('Notification permission granted');
      } else if (result === RESULTS.DENIED) {
        console.log('Requesting notification permission...');
        requestNotificationPermission(permission);
      } else if (result === RESULTS.BLOCKED) {
        console.log('Notification permission blocked');
        Alert.alert(
          'Permission Required',
          'Please enable notifications to receive alerts from this app.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () =>
                openSettings().catch(() => {
                  console.warn('Unable to open settings');
                }),
            },
          ],
        );
      }
    } catch (error) {
      console.warn('Error checking notification permission:', error);
    }
  };

  const requestNotificationPermission = async permission => {
    try {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        console.log('Notification permission granted');
        ToastAndroid.show('Permission Granted', ToastAndroid.SHORT);
      } else {
        console.log('Notification permission denied');
        Alert.alert(
          'Permission Required',
          'Please enable notifications to receive alerts from this app.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () =>
                openSettings().catch(() => {
                  console.warn('Unable to open settings');
                }),
            },
          ],
        );
      }
    } catch (error) {
      console.warn('Error requesting notification permission:', error);
    }
  };

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
