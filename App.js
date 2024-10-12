import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
import {NavigationContainer} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store/store';
import {STRIPE_PUBLISHABLE_KEY} from '@env';
import {LogBox, Platform, PermissionsAndroid, Alert} from 'react-native';
import Toast from 'react-native-toast-message'
LogBox.ignoreAllLogs(true);

const App = () => {
  useEffect(() => {
    console.log('Configuring notifications...');
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION RECEIVED:', notification);
        // process the notification
      },
      requestPermissions: Platform.OS === 'ios',
    });

    // Request notification permission and create channel
    requestNotificationPermission();
  }, []);

  // Function to request notification permission and create channel
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
          // Create notification channel for Android
          createNotificationChannel();
        } else {
          console.log('Notification permission denied');
          Alert.alert(
            'Permission required',
            'Notification permission is required to receive prayer alarms.',
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      PushNotification.requestPermissions().then(permission => {
        if (permission.alert || permission.sound || permission.badge) {
          console.log('Notification permission granted');
          // Create notification channel for iOS
          createNotificationChannel();
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

  const createNotificationChannel = () => {
    console.log('Creating notification channel...');
    PushNotification.createChannel(
      {
        channelId: 'prayer_reminder',
        channelName: 'Prayer Alarm',
        playSound: true,
        soundName: 'azan.mp3', 
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Channel created : ${created}`),
    );
  };

  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <NavigationContainer>
          <AppNavigator />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
};

export default App;
