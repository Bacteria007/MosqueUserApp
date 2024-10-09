import { NativeModules, Platform, Alert } from 'react-native';
const { SilentModeModule } = NativeModules;

const enableSilentModeForDuration = (duration) => {
  // Convert duration to milliseconds
  const durationInMillis = duration * 60 * 1000;

  // Request permission for ringer mode changes (Android only)
  if (Platform.OS === 'android') {
    requestRingerModePermission().then(granted => {
      if (granted) {
        SilentModeModule.enableSilentMode(); // Activate silent mode
        setTimeout(() => {
          SilentModeModule.disableSilentMode(); // Disable silent mode after the selected duration
          console.log(`Silent mode deactivated after ${duration} minutes`);
        }, durationInMillis);
      } else {
        Alert.alert('Permission required', 'Please grant permission to modify the ringer mode.');
      }
    });
  }
};

// Function to check and request permission
const requestRingerModePermission = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      const notificationManager = NativeModules.NotificationManager;
      if (notificationManager.isNotificationPolicyAccessGranted()) {
        resolve(true);
      } else {
        // Open settings to grant permission
        NativeModules.Settings.openNotificationPolicyAccessSettings();
        resolve(false);
      }
    } else {
      resolve(true); // No need for permission on iOS
    }
  });
};
