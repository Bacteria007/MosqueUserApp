import PushNotification from 'react-native-push-notification';

// Create notification channel
export const createNotificationChannel = () => {
  PushNotification.createChannel({
    channelId: 'prayer_reminder',
    channelName: 'Prayer Reminder',
    importance: 4,
    vibrate: true,
  });
};

// Schedule prayer notifications based on today's remaining prayer times
export const schedulePrayerNotifications = (remainingPrayers = []) => {
  if (!Array.isArray(remainingPrayers) || remainingPrayers.length === 0) {
    console.log('No remaining prayers to schedule notifications for.');
    return;
  }

  console.log('Scheduling notifications for the following prayers:', remainingPrayers);

  remainingPrayers.forEach((prayer) => {
    const timeString = prayer.time;
    if (timeString) {
      const [hour, minute] = timeString.split(':');
      const notificationTime = new Date();
      notificationTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

      if (notificationTime > new Date()) {
        PushNotification.localNotificationSchedule({
          id: `${prayer.name}_reminder`,
          channelId: 'prayer_reminder',
          message: `${prayer.name} prayer time!`,
          date: notificationTime,
          allowWhileIdle: true,
        });
        console.log(`Scheduled alarm for ${prayer.name} at ${notificationTime}`);
      }
    }
  });
};

// Cancel all notifications
export const cancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
  console.log('All notifications cancelled.');
};
