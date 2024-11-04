// src/utils/NotificationUtils.js
import notifee, { EventType, TriggerType, TimestampTrigger } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import moment from 'moment';
import { appName } from '../services/constants';
import calendarData from '../calendar.json';

// Request notification permission for Android 13+
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
const formatTo12Hour = time => moment(time, 'HH:mm:ss').format('h:mm A');

// Calculate the trigger timestamp for the prayer time
const calculateTriggerTimestamp = prayerTime => {
  const currentTime = moment();
  const targetTime = moment(prayerTime, 'HH:mm:ss');

  if (targetTime.isBefore(currentTime)) {
    console.log(`Prayer time for ${prayerTime} has already passed today`);
    return null;
  }

  return targetTime.valueOf();
};

// Handle notification interaction
notifee.onForegroundEvent(({ type, detail }) => {
  if (type === EventType.ACTION_PRESS) {
    console.log('User clicked the notification:', detail.notification);
    // Additional logic for notification interaction
  }
});

// Check if a notification is already scheduled for a specific prayer
async function isNotificationScheduled(prayerName) {
  const notifications = await notifee.getTriggerNotifications();
  return notifications.some(notification => {
    const { title } = notification.notification;
    return title.includes(prayerName);
  });
}

// Schedule notifications for all prayers of today
export async function schedulePrayerAlarms() {
  console.log('Scheduling prayer notifications for today');

  await requestNotificationPermission();

  const todayDate = moment().format('D/M');
  const todayPrayers = calendarData.find(item => item.date === todayDate);

  if (todayPrayers) {    
    const prayersArray = [
      { name: 'Fajr', time: todayPrayers.sehri_end },
      { name: 'Zuhr', time: todayPrayers.zuhar_begin },
      { name: 'Asr', time: todayPrayers.asar_begin },
      { name: 'Maghrib', time: todayPrayers.magrib_jamat },
      { name: 'Isha', time: todayPrayers.isha_begin },
    ];

    const channelId = await notifee.createChannel({
      id: 'upcoming_prayer',
      name: 'Prayer Reminder',
      sound: 'azan',
    });

    for (const prayer of prayersArray) {
      const isScheduled = await isNotificationScheduled(prayer.name);
      if (isScheduled) {
        console.log(`Skipping ${prayer.name}, notification already scheduled.`);
        continue;
      }

      const formattedTime = formatTo12Hour(prayer.time);
      const triggerTimestamp = calculateTriggerTimestamp(prayer.time);

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
  } else {
    console.warn('No prayer data found for today.');
  }
}

// Cancel all scheduled notifications
export const cancelAllScheduledNotifications = async () => {
  try {
    const notifications = await notifee.getTriggerNotifications();

    for (const notification of notifications) {
      const { id } = notification.notification;
      if (id) {
        await notifee.cancelNotification(id);
        console.log(`Canceled notification with ID: ${id}`);
      } else {
        console.warn('Notification ID is missing, skipping cancellation.');
      }
    }

    console.log('All scheduled notifications have been canceled.');
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};
