import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import calendarData from '../calendar.json';

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    prayerData: null,
    nextPrayer: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchPrayerDataForDate: (state, action) => {
      const dateString = action.payload;
      const formattedDate = moment(dateString, 'DD MMMM, YYYY').format('D/M');
      const prayerData = calendarData.find(item => item.date === formattedDate);

      if (prayerData) {
        state.prayerData = {
          date: dateString,
          prayerTimes: [
            { name: 'Fajr', time: prayerData.fajar_jamat },
            { name: 'Zuhur', time: prayerData.zuhar_jamat },
            { name: 'Asar', time: prayerData.asar_jamat },
            { name: 'Maghrib', time: prayerData.magrib_jamat },
            { name: 'Isha', time: prayerData.isha_jamat },
          ],
        };
        state.error = null;
      } else {
        state.prayerData = null;
        state.error = `No prayer data found for ${dateString}`;
      }
    },
    getNextPrayerData: (state) => {
      const todayDate = moment().format('D/M');
      const todayPrayers = calendarData.find(item => item.date === todayDate);

      if (todayPrayers) {
        const prayerSchedule = [
          { name: 'Fajr', time: todayPrayers.fajar_jamat },
          { name: 'Zuhur', time: todayPrayers.zuhar_jamat },
          { name: 'Asar', time: todayPrayers.asar_jamat },
          { name: 'Maghrib', time: todayPrayers.magrib_jamat },
          { name: 'Isha', time: todayPrayers.isha_jamat },
        ];

        const currentTime = moment();
        for (const prayer of prayerSchedule) {
          const prayerTime = moment(prayer.time, 'HH:mm');
          if (prayerTime.isAfter(currentTime)) {
            state.nextPrayer = prayer;
            return;
          }
        }
        state.nextPrayer = prayerSchedule[0]; // Wrap around to the first prayer if all have passed
      } else {
        state.nextPrayer = null;
      }
    },
  },
});

export const { fetchPrayerDataForDate, getNextPrayerData } = calendarSlice.actions;
export default calendarSlice.reducer;
