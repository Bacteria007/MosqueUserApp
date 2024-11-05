import notifee, { TriggerType } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import moment from 'moment';
import { appName } from '../services/constants';
import calendarData from '../calendar.json';

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

const formatTo12Hour = time => moment(time, 'HH:mm:ss').format('h:mm A');

const calculateTriggerTimestamp = (prayerTime, dayOffset = 0) => {
  const targetTime = moment()
    .startOf('day')
    .add(dayOffset, 'days')
    .add(moment(prayerTime, 'HH:mm:ss').hours(), 'hours')
    .add(moment(prayerTime, 'HH:mm:ss').minutes(), 'minutes');
  return targetTime.isAfter(moment()) ? targetTime.valueOf() : null;
};

async function isNotificationScheduled(prayerName, dateKey) {
  const notifications = await notifee.getTriggerNotifications();
  return notifications.some(notification => {
    const { title } = notification.notification;
    return title.includes(prayerName) && title.includes(dateKey);
  });
}

export async function scheduleTwoWeeksOfPrayerAlarms() {
  console.log('Scheduling notifications for the next two weeks...');

  await requestNotificationPermission();

  const channelId = await notifee.createChannel({
    id: 'upcoming_prayer',
    name: 'Prayer Reminder',
    sound: 'azan',
  });

  for (let day = 0; day < 14; day++) {
    const dateKey = moment().add(day, 'days').format('D/M');
    const dailyPrayers =
      calendarData.find(entry => entry.date === dateKey) ||
      calendarData.find(entry => entry.date === moment().add(day, 'days').format('DD/MM'));

    if (dailyPrayers) {
      const prayerSchedule = [
        { name: 'Fajr', time: dailyPrayers.sehri_end },
        { name: 'Zuhr', time: dailyPrayers.zuhar_begin },
        { name: 'Asr', time: dailyPrayers.asar_begin },
        { name: 'Maghrib', time: dailyPrayers.magrib_jamat },
        { name: 'Isha', time: dailyPrayers.isha_begin },
      ];

      for (const prayer of prayerSchedule) {
        const isScheduled = await isNotificationScheduled(prayer.name, dateKey);
        if (isScheduled) {
          console.log(`Skipping ${prayer.name} on ${dateKey}, notification already scheduled.`);
          continue;
        }

        const triggerTimestamp = calculateTriggerTimestamp(prayer.time, day);
        if (!triggerTimestamp || triggerTimestamp < moment().valueOf()) {
          console.log(`Skipping ${prayer.name} on ${dateKey}, time has already passed.`);
          continue;
        }

        const trigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerTimestamp,
        };

        try {
          await notifee.createTriggerNotification(
            {
              title: `${prayer.name} - ${formatTo12Hour(prayer.time)} (${dateKey})`,
              subtitle: appName,
              body: `It's time for ${prayer.name} prayer on ${dateKey}`,
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
          console.log(`Scheduled ${prayer.name} for ${dateKey} at ${formatTo12Hour(prayer.time)}`);
        } catch (error) {
          console.error(`Failed to schedule ${prayer.name} for ${dateKey}:`, error);
        }
      }
    }
  }
}

export const rescheduleBiweeklyPrayerAlarms = async () => {
  await cancelAllScheduledNotifications();
  await scheduleTwoWeeksOfPrayerAlarms();
};

export const cancelAllScheduledNotifications = async () => {
  try {
    const notifications = await notifee.getTriggerNotifications();
    notifications.forEach(notification => {
      notifee.cancelNotification(notification.notification.id);
    });
    console.log('All scheduled notifications have been canceled.');
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};
