import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

export const createNotificationChannel = async () => {
  const channelId = await notifee.createChannel({
    id: 'prayer_reminder',
    name: 'Prayer Reminder',
    importance: notifee.AndroidImportance.HIGH,
    sound: 'default',
  });
  return channelId;
};

export const schedulePrayerNotifications = async (remainingPrayers = []) => {
  if (!Array.isArray(remainingPrayers) || remainingPrayers.length === 0) {
    console.log('No remaining prayers to schedule notifications for.');
    return;
  }

  console.log('Scheduling notifications for the following prayers:', remainingPrayers);

  const channelId = await createNotificationChannel();

  remainingPrayers.forEach(async (prayer) => {
    const timeString = prayer.time;
    if (timeString) {
      const [hour, minute] = timeString.split(':');
      const notificationTime = new Date();
      notificationTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

      if (notificationTime > new Date()) {
        const trigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: notificationTime.getTime(),
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

export const cancelAllNotifications = async () => {
  await notifee.cancelAllNotifications();
  console.log('All notifications cancelled.');
};
