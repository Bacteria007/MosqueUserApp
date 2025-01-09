import notifee, {
  EventType,
  TriggerType,
  AndroidVisibility,
  AndroidImportance,
} from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import moment from 'moment'; // For time formatting and calculations
import {appName} from '../services/constants';

// Ensure notification permission for Android 13+
async function requestNotificationPermission() {
  if (Platform.OS == 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted == PermissionsAndroid.RESULTS.GRANTED) {
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

const calculateTriggerTimestamp = prayerTime => {
  const currentTime = moment();
  const targetTime = moment(prayerTime, 'HH:mm:ss');

  if (targetTime.isBefore(currentTime)) {
    console.log(`Prayer time for ${prayerTime} has already passed today`);
    return null;
  }

  console.log('Trigger timestamp: ', targetTime.valueOf()); // Debug line
  return targetTime.valueOf(); // Returns the timestamp in milliseconds
};

// Handle notification events when the user interacts with the notification
notifee.onForegroundEvent(({type, detail}) => {
  if (type === EventType.ACTION_PRESS) {
    console.log('User clicked the notification:', detail.notification);
    // Add navigation or other logic here to open a specific screen when the notification is clicked
  }
});

async function isNotificationScheduled(prayerName, triggerTimestamp) {
  const notifications = await notifee.getTriggerNotifications();

  return notifications.some(notification => {
    const {title} = notification.notification || {};
    console.log('triger 1',notification.trigger?.timestamp,'triger 2',triggerTimestamp,'title 1',title,'title2',prayerName);
    
    return (
      title.includes(prayerName) &&
      notification.trigger?.timestamp === triggerTimestamp
    );

  });
}

export async function schedulePrayerAlarms(prayers) {
  console.log('Notification data:', prayers);

  // Request notification permission
  await requestNotificationPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'upcoming_prayer',
    name: 'Prayer Reminder',
    sound: 'azan',
    importance: AndroidImportance.HIGH,
  });

  for (const prayer of prayers) {
    const formattedBeginTime = formatTo12Hour(prayer.time);
    const formattedJamatTime = formatTo12Hour(prayer.jamatTime);
    const triggerTimestamp = calculateTriggerTimestamp(prayer.time);
    const isScheduled = await isNotificationScheduled(
      prayer.name,
      triggerTimestamp,
    );
    if (isScheduled) {
      console.log(`Skipping ${prayer.name}, notification already scheduled.`);
      continue;
    }

    if (!triggerTimestamp) {
      console.log(`Skipping ${prayer.name}, time has already passed.`);
      continue;
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTimestamp,
    };

    try {
      await notifee.createTriggerNotification(
        {
          title: `${prayer.name}`,
          subtitle: appName,
          body: `Begins: ${formattedBeginTime} | Jama'ah: ${formattedJamatTime}`,
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            largeIcon: 'ic_launcher',
            sound: 'azan',
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
          },
        },
        trigger,
      );
      console.log(
        `Notification scheduled successfully for ${prayer.name} at ${formattedBeginTime}`,
      );
    } catch (error) {
      console.error(
        `Failed to schedule notification for ${prayer.name}:`,
        error,
      );
    }
  }
}

export const cancelAllScheduledNotifications = async () => {
  try {
    const notifications = await notifee.getTriggerNotifications();

    notifications.forEach(notification => {
      const {id} = notification.notification; // Extract the ID correctly
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

// export async function schedulePrayerAlarms(prayers, date) {
//   console.log('Notification data:', prayers);

//   // Request notification permission
//   await requestNotificationPermission();

//   // Create a channel (required for Android)
//   const channelId = await notifee.createChannel({
//     id: 'upcoming_prayer',
//     name: 'Prayer Reminder',
//     sound: 'azan',
//     importance: AndroidImportance.HIGH,
//     audioAttributes: {
//       usage: AndroidAudioUsage.ALARM,
//       // contentType: AndroidAudioContentType.SONIFICATION,
//       // flags: [AndroidAudioFlags.LOOP],
//     },
//   });

//   // Loop through each prayer and schedule a notification
//   for (const prayer of prayers) {
//     // Check if notification is already scheduled for this prayer on this date
//     const isScheduled = await isNotificationScheduled(prayer.name, date);
//     if (isScheduled) {
//       console.log(
//         `Skipping ${prayer.name} on ${date}, notification already scheduled.`,
//       );
//       continue;
//     }

//     // Calculate formatted time and the trigger timestamp
//     const formattedTime = formatTo12Hour(prayer.time);
//     const triggerTimestamp = calculateTriggerTimestamp(prayer.time);

//     if (!triggerTimestamp) {
//       console.log(`Skipping ${prayer.name}, time has already passed.`);
//       continue;
//     }

//     // Create the notification trigger for the prayer time
//     const trigger = {
//       type: TriggerType.TIMESTAMP,
//       timestamp: triggerTimestamp, // Schedule for the prayer time
//     };

//     // Schedule a notification
//     try {
//       await notifee.createTriggerNotification(
//         {
//           title: `${prayer.name} - ${formattedTime}`,
//           subtitle: appName,
//           body: `It's time for ${prayer.name} prayer on ${date}`,
//           android: {
//             channelId,
//             smallIcon: 'ic_launcher',
//             largeIcon: 'ic_launcher',
//             sound: 'azan',
//             pressAction: {
//               id: 'default',
//               launchActivity: 'default',
//             },
//             importance: AndroidImportance.MAX, // Maximum priority to wake the screen
//             fullScreenAction: {
//               id: 'default', // Define the action that should happen when full screen intent is displayed
//             },
//             visibility: AndroidVisibility.PUBLIC,
//           },
//         },
//         trigger,
//       );
//       console.log(
//         `Notification scheduled successfully for ${prayer.name} on ${date} at ${formattedTime}`,
//       );
//     } catch (error) {
//       console.error(
//         `Failed to schedule notification for ${prayer.name}:`,
//         error,
//       );
//     }
//   }
// }
