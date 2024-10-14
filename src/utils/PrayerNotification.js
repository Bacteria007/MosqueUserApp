import notifee, {
  EventType,
  TriggerType,
  TimestampTrigger,
  AndroidImportance,
} from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import moment from 'moment'; // For time formatting and calculations
import {appName} from '../services/constants';

// Ensure notification permission for Android 13+
async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  }
}

// Format time to 12-hour format
const formatTo12Hour = time => {
  return moment(time, 'HH:mm:ss').format('h:mm A'); // Convert to 12-hour format
};

notifee.onForegroundEvent(({type, detail}) => {
  if (type == EventType.ACTION_PRESS) {
    console.log('User clicked the notification:', detail.notification);
    // Add navigation or other logic here to open a specific screen when the notification is clicked
  }
});

export async function onDisplayNotification(prayer, delayInSeconds = 10) {
  console.log('Notification data:', prayer);

  await requestNotificationPermission();

  const formattedTime = formatTo12Hour(prayer.time);

  const triggerTimestamp = Date.now() + delayInSeconds * 1000;

  await notifee.deleteChannel('upcoming_prayer');

  const channelId = await notifee.createChannel({
    id: 'upcoming_prayer',
    name: 'Prayer Reminder',
    sound: 'azan', // Ensure the sound file is referenced
    importance: AndroidImportance.HIGH, // Ensure sound will play
    vibration: true, // Optional, allows vibration in addition to sound
  });

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerTimestamp,
  };

  try {
    await notifee.createTriggerNotification(
      {
        title: `${prayer.name} ${formattedTime}`,
        subtitle: appName,
        body: `It's time for ${prayer.name} prayer`,
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          largeIcon: require('../assets/images/prayer.jpg'),
          sound: 'azan',
          vibration: true, // Enable vibration along with sound
          importance: AndroidImportance.HIGH, // Ensure sound will play
          pressAction: {
            id: 'default',
          },
          // ongoing:true
        },
        
      },
      trigger,
    );
    console.log(
      `Notification scheduled successfully for ${delayInSeconds} seconds later`,
    );
  } catch (error) {
    console.error('Failed to schedule notification:', error);
  }
}
