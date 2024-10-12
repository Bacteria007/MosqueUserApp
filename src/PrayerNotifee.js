import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

// Create a notification channel
export const createNotificationChannel = async () => {
  const channelId = await notifee.createChannel({
    id: 'prayer_reminder',
    name: 'Prayer Reminder',
    importance: notifee.AndroidImportance.HIGH,
    sound: 'default',
  });
  return channelId;
};

// Schedule prayer notifications based on today's remaining prayer times
export const schedulePrayerNotifications = async (remainingPrayers = []) => {
  if (!Array.isArray(remainingPrayers) || remainingPrayers.length === 0) {
    console.log('No remaining prayers to schedule notifications for.');
    return;
  }

  console.log('Scheduling notifications for the following prayers:', remainingPrayers);

  const channelId = await createNotificationChannel(); // Create or get the notification channel

  remainingPrayers.forEach(async (prayer) => {
    const timeString = prayer.time;
    if (timeString) {
      const [hour, minute] = timeString.split(':');
      const notificationTime = new Date();
      notificationTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

      // Ensure the notification time is in the future
      if (notificationTime > new Date()) {
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: notificationTime.getTime(), // The time when the notification should appear
        };

        await notifee.createTriggerNotification(
          {
            title: `${prayer.name} Prayer Reminder`,
            body: `It's time for ${prayer.name} prayer.`,
            android: {
              channelId,
              sound: 'default',
            },
          },
          trigger
        );
        console.log(`Scheduled alarm for ${prayer.name} at ${notificationTime}`);
      }
    }
  });
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  await notifee.cancelAllNotifications();
  console.log('All notifications cancelled.');
};
