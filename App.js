import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import { NavigationContainer } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store/store';
import { STRIPE_PUBLISHABLE_KEY } from '@env';
import { LogBox, Platform, PermissionsAndroid } from 'react-native';

LogBox.ignoreAllLogs(true);

const App = () => {
  
  
  useEffect(() => {
    console.log("Configuring notifications...");
    PushNotification.configure({
      onNotification: function (notification) {
        console.log("NOTIFICATION RECEIVED:", notification);
        // process the notification
      },
      requestPermissions: Platform.OS === 'ios',
    });
    
  
    createNotificationChannel()
  }, []);

  const createNotificationChannel = () => {
    console.log("Creating notification channel...");
    PushNotification.createChannel(
      {
        channelId: "prayer_reminder",
        channelName: "Prayer Alarm",
        playSound: true,
        soundName: "alarm_sound",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created successfully: ${created}`)
    );
  };
  
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
};

export default App;
