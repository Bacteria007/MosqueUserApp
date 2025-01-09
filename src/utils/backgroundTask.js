// src/utils/backgroundTask.js
import { schedulePrayerAlarms } from './PrayerAlarm';
import getTodaysPrayers from './getTodayPrayers';

export const handleBackgroundTask = async () => {
  try {
    console.log("[handleBackgroundTask] Fetching today's prayers...");
    const prayers = await getTodaysPrayers();
    if (prayers) {
      await schedulePrayerAlarms(prayers);
      console.log('[handleBackgroundTask] Notifications scheduled.');
    } else {
      console.warn('[handleBackgroundTask] No prayer times available.');
    }
  } catch (error) {
    console.error('[handleBackgroundTask] Error scheduling tasks:', error);
  }
};
