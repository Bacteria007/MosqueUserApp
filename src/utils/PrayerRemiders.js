// import PushNotification from 'react-native-push-notification';

// // Create notification channel
// export const createNotificationChannel = () => {
//   PushNotification.createChannel(
//     {
//       channelId: 'prayer_reminder',
//       channelName: 'Prayer Reminder',
//       importance: 4,
//       vibrate: true,
//     },
//     created => console.log(`Notification channel created: ${created}`), // Log whether the channel was created
//   );
// };

// // Get all scheduled notifications and check if a prayer notification is already scheduled
// const isNotificationScheduled = (prayerName, scheduledNotifications) => {
//   return scheduledNotifications.some(
//     notification => notification.id === `${prayerName}_reminder`,
//   );
// };

// // Schedule prayer notifications based on today's remaining prayer times
// export const schedulePrayerNotifications = async (remainingPrayers = []) => {
//   if (!Array.isArray(remainingPrayers) || remainingPrayers.length === 0) {
//     console.log('No remaining prayers to schedule notifications for.');
//     return;
//   }

//   console.log(
//     'Scheduling notifications for the following prayers:',
//     remainingPrayers,
//   );

//   // Fetch all currently scheduled notifications
//   PushNotification.getScheduledLocalNotifications(scheduledNotifications => {
//     remainingPrayers.forEach(prayer => {
//       const timeString = prayer.time;

//       if (timeString) {
//         const [hour, minute] = timeString.split(':');
//         const notificationTime = new Date();
//         notificationTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

//         // Check if the notification is already scheduled
//         if (!isNotificationScheduled(prayer.name, scheduledNotifications)) {
//           if (notificationTime > new Date()) {
//             PushNotification.localNotificationSchedule({
//               id: `${prayer.name}_reminder`, // Unique ID for each prayer
//               channelId: 'prayer_reminder',
//               message: `${prayer.name} prayer time!`,
//               date: notificationTime,
//               allowWhileIdle: true,
//             });
//             console.log(
//               `Scheduled alarm for ${prayer.name} at ${notificationTime}`,
//             );
//           }
//         } else {
//           console.log(`Notification for ${prayer.name} is already scheduled.`);
//         }
//       }
//     });
//   });
// };

// export const cancelAllScheduledNotifications = () => {
//   PushNotification.getScheduledLocalNotifications(notifications => {
//     if (notifications.length > 0) {
//       console.log('Cancelling all scheduled notifications:', notifications);
//       notifications.forEach(notification => {
//         PushNotification.cancelLocalNotification(notification.id);
//       });
//     } else {
//       console.log('No scheduled notifications to cancel.');
//     }
//   });
//   PushNotification.cancelAllLocalNotifications(); // Ensure all are cleared
//   console.log('All notifications cancelled.');
// };
