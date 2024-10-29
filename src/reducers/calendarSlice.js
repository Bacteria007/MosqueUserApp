import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiService from '../services/api';
import {prayerTimesURL} from '../services/constants';
import moment from 'moment';
import {schedulePrayerAlarms} from '../utils/PrayerAlarm';

// Fetch prayer times asynchronously
export const fetchPrayerTimes = createAsyncThunk(
  'calendar/fetchPrayerTimes',
  async () => {
    const response = await ApiService({method: 'GET', url: prayerTimesURL});
    return response.data;
  },
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    prayerTimes: [],
    weeklyPrayerTimes: [],
    todayPrayers: {},
    filteredPrayerTimes: {},
    upcomingPrayer: null,
    nextPrayer: null,
    selectedDate: moment().format('DD MMMM, YYYY'),
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    filterTodayPrayers: state => {
      const today = moment().format('DD MMMM, YYYY');
      state.todayPrayers =
        state.prayerTimes.find(
          item => moment(item.date).format('DD MMMM, YYYY') == today,
        ) || {};
    },
    filterPrayerTimes: state => {
      state.filteredPrayerTimes =
        state.prayerTimes.find(
          item =>
            moment(item.date).format('DD MMMM, YYYY') == state.selectedDate,
        ) || {};
    },
    calculateUpcomingAndNextPrayers: state => {
      const times = state.todayPrayers;

      if (!times || Object.keys(times).length === 0) {
        console.log('No prayer times available for today.');
        return;
      }

      const prayerTimes = [
        {name: 'Fajr', time: times.fajar_jamat},
        {name: 'Zuhur', time: times.zuhar_jamat},
        {name: 'Asr', time: times.asar_jamat},
        {name: 'Maghrib', time: times.magrib_jamat},
        {name: 'Isha', time: times.isha_jamat},
      ];

      const currentTime = moment();
      console.log('Current time:', currentTime.format('HH:mm'));

      let upcoming = null;
      let next = null;
      const remainingPrayers = [];

      for (let i = 0; i < prayerTimes.length; i++) {
        const prayerTime = moment(prayerTimes[i].time, 'HH:mm');

        console.log(
          `${prayerTimes[i].name} prayer time: ${prayerTime.format('HH:mm')}`,
        );

        if (prayerTime.isAfter(currentTime)) {
          if (!upcoming) {
            upcoming = prayerTimes[i];
            next = prayerTimes[i + 1] || prayerTimes[0];
          }
          remainingPrayers.push(prayerTimes[i]);
        }
      }

      state.upcomingPrayer = upcoming || prayerTimes[0];
      state.nextPrayer = next || prayerTimes[1];

      // console.log('Upcoming prayer object:', state.upcomingPrayer);

      console.log(
        `Next prayer: ${state.nextPrayer ? state.nextPrayer.name : 'None'}`,
      );

      if (remainingPrayers.length > 0) {
        console.log('Remaining prayers for notifications:', remainingPrayers);
        // schedulePrayerAlarms(remainingPrayers);
      }
    },
    calculateWeeklyPrayers: (state) => {
      const today = moment(); // Today's date
      const nextSevenDays = moment().add(7, 'days'); // Date 7 days from today
    
      state.weeklyPrayerTimes = state.prayerTimes.filter((item) => {
        const prayerDate = moment(item.date, 'YYYY-MM-DD'); // Assuming date format is 'YYYY-MM-DD'
        return prayerDate.isBetween(today, nextSevenDays, null, '[]'); // Check if within the next 7 days
      });
    
      console.log('Next 7 days prayer times:', state.weeklyPrayerTimes);
    }, 
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPrayerTimes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrayerTimes.fulfilled, (state, action) => {
        state.loading = false;
        state.prayerTimes = action.payload;
      })
      .addCase(fetchPrayerTimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedDate,
  filterTodayPrayers,
  filterPrayerTimes,
  calculateUpcomingAndNextPrayers,
  calculateWeeklyPrayers
} = calendarSlice.actions;

export default calendarSlice.reducer;
