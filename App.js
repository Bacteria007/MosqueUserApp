import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
import {NavigationContainer} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store/store';
import {STRIPE_PUBLISHABLE_KEY} from '@env';
import {LogBox, Platform, PermissionsAndroid, Alert} from 'react-native';
import Toast from 'react-native-toast-message';

LogBox.ignoreAllLogs(true);

const App = () => {
  useEffect(() => {
    console.log('Configuring notifications...');
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION RECEIVED:', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });

    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app requires permission to send notifications.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
          Alert.alert(
            'Permission required',
            'Notification permission is required to receive notifications.',
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      PushNotification.requestPermissions().then(permission => {
        if (permission.alert || permission.sound || permission.badge) {
          console.log('Notification permission granted');
   
        } else {
          console.log('Notification permission denied');
          Alert.alert(
            'Permission required',
            'Notification permission is required to receive notifications.',
          );
        }
      });
    }
  };

  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <NavigationContainer>
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
};

export default App;
