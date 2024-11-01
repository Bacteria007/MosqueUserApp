import notifee, { EventType, TriggerType, TimestampTrigger } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import moment from 'moment'; // For time formatting and calculations
import { appName } from '../services/constants';
import transformFuturePrayers from './TransformPrayerData';

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

// Calculate the future timestamp for the prayer time
const calculateTriggerTimestamp = prayerTime => {
  const currentTime = moment();
  const targetTime = moment(prayerTime, 'HH:mm:ss');

  if (targetTime.isBefore(currentTime)) {
    console.log(`Prayer time for ${prayerTime} has already passed today`);
    return null;
  }

  return targetTime.valueOf(); // Returns the timestamp in milliseconds
};

// Handle notification events when the user interacts with the notification
notifee.onForegroundEvent(({ type, detail }) => {
  if (type === EventType.ACTION_PRESS) {
    console.log('User clicked the notification:', detail.notification);
    // Add navigation or other logic here to open a specific screen when the notification is clicked
  }
});

// Check if a notification for a specific prayer is already scheduled
// async function isNotificationScheduled(prayerName) {
//   const notifications = await notifee.getTriggerNotifications();
//   return notifications.some(notification => 
//     notification.notification.title.includes(prayerName)
//   );
// }

// async function isNotificationScheduled(prayerName, prayerDate) {
//   const notifications = await notifee.getTriggerNotifications();

//   return notifications.some(notification => {
//     const { title, body } = notification.notification;
//     const scheduledDate = moment(body.match(/\d{4}-\d{2}-\d{2}/), 'YYYY-MM-DD');
//     return title.includes(prayerName) && scheduledDate.isSame(prayerDate, 'day');
//   });
// }
async function isNotificationScheduled(prayerName) {
  const notifications = await notifee.getTriggerNotifications();

  return notifications.some(notification => {
    const { title } = notification.notification;
    return title.includes(prayerName);
  });
}

// Function to schedule alarms for all prayers in the array
export async function schedulePrayerAlarms(prayers) {
  console.log('Notification data:', prayers);

  // Request notification permission
  await requestNotificationPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'upcoming_prayer',
    name: 'Prayer Reminder',
    sound: 'azan',
  });

  // Loop through each prayer and schedule a notification
  for (const prayer of prayers) {
    // Check if notification is already scheduled for this prayer
    const isScheduled = await isNotificationScheduled(prayer.name);
    if (isScheduled) {
      console.log(`Skipping ${prayer.name}, notification already scheduled.`);
      continue;
    }

    // Calculate formatted time and the trigger timestamp
    const formattedTime = formatTo12Hour(prayer.time);
    const triggerTimestamp = calculateTriggerTimestamp(prayer.time);

    if (!triggerTimestamp) {
      console.log(`Skipping ${prayer.name}, time has already passed.`);
      continue;
    }

    // Create the notification trigger for the prayer time
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTimestamp, // Schedule for the prayer time
    };

    // Schedule a notification
    try {
      await notifee.createTriggerNotification(
        {
          title: `${prayer.name} ${formattedTime}`,
          subtitle: appName,
          body: `It's time for ${prayer.name} prayer`,
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            largeIcon: 'ic_launcher',
            sound: 'azan',
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
          },
        },
        trigger,
      );
      console.log(`Notification scheduled successfully for ${prayer.name} at ${formattedTime}`);
    } catch (error) {
      console.error(`Failed to schedule notification for ${prayer.name}:`, error);
    }
  }
}
export const cancelAllScheduledNotifications = async () => {
  try {
    const notifications = await notifee.getTriggerNotifications();
    
    notifications.forEach(notification => {
      const { id } = notification.notification; // Extract the ID correctly
      if (id) {
        notifee.cancelNotification(id); // Cancel notification using the correct ID
        console.log(`Canceled notification with ID: ${id}`);
      } else {
        console.warn('Notification ID is missing, skipping cancellation.');
      }
    });

    console.log('All scheduled notifications have been canceled.');
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};