import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import { firebase } from '@react-native-firebase/app';

// Register the background handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('Background notification event:', type, detail);

  // Handle the event (e.g., when a user clicks on a notification)
  if (type === EventType.ACTION_PRESS) {
    console.log('Notification action pressed in the background', detail.notification);
    // Perform any background work here or navigation logic if needed
  }
  if (!firebase.apps.length) {
    firebase.initializeApp();
  }
});

AppRegistry.registerComponent(appName, () => App);
