import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import calendarData from '../calendar.json';

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    prayerData: null,
    calendar:[],
    nextPrayer: null,
    loading: false,
    error: null,
  },
  reducers: {
    getCalendar:(state)=>{
      state.calendar=calendarData;
    },
    fetchPrayerDataForDate: (state, action) => {
      const dateString = action.payload;
      const formattedDate = moment(dateString, 'DD MMMM, YYYY').format('DD/MM');
      const prayerData = calendarData.find(item => item.date === formattedDate);

      if (prayerData) {
        state.prayerData = {
          date: dateString,
          prayerTimes: [
            {name: 'Fajr', time: prayerData.sehri_end},
            {name: 'Zuhr', time: prayerData.zuhar_begin},
            {name: 'Asr', time: prayerData.asar_begin},
            {name: 'Maghrib', time: prayerData.magrib_jamat},
            {name: 'Isha', time: prayerData.isha_begin},
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
          {name: 'Fajr', time: todayPrayers.sehri_end},
          {name: 'Zuhr', time: todayPrayers.zuhar_begin},
          {name: 'Asr', time: todayPrayers.asar_begin},
          {name: 'Maghrib', time: todayPrayers.magrib_jamat},
          {name: 'Isha', time: todayPrayers.isha_begin},
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

export const { fetchPrayerDataForDate, getNextPrayerData ,getCalendar} = calendarSlice.actions;
export default calendarSlice.reducer;
