import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiService from '../services/api';
import {prayerTimesURL} from '../services/constants';
import {schedulePrayerNotifications} from '../utils/PrayerRemiders';
import moment from 'moment';

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
      if (!times) return;

      const prayerTimes = [
        {name: 'Fajr', time: times.fajar_jamat},
        {name: 'Dhuhr', time: times.zuhar_jamat},
        {name: 'Asr', time: times.asar_jamat},
        {name: 'Maghrib', time: times.magrib_jamat},
        {name: 'Isha', time: times.isha_jamat},
      ];

      const currentTime = moment(); // Get the current time

      let upcoming = null;
      let next = null;
      const remainingPrayers = [];

      // Iterate over the prayer times to find the upcoming prayer and the remaining ones
      for (let i = 0; i < prayerTimes.length; i++) {
        const prayerTime = moment(prayerTimes[i].time, 'HH:mm'); // Parse prayer time

        if (prayerTime.isAfter(currentTime)) {
          if (!upcoming) {
            // The first prayer time that's after the current time is the upcoming prayer
            upcoming = prayerTimes[i];
            next = prayerTimes[i + 1] || prayerTimes[0]; // Get the next prayer or wrap around to Fajr
          }
          // Add remaining prayers (those after the current time) to the list
          remainingPrayers.push(prayerTimes[i]);
        }
      }

      // If no upcoming prayer is found (e.g., it's past Isha), default to the next day's Fajr
      state.upcomingPrayer = upcoming || prayerTimes[0];
      state.nextPrayer = next || prayerTimes[1];

      console.log(`Upcoming prayer: ${state.upcomingPrayer.name}`);
      console.log(`Next prayer: ${state.nextPrayer.name}`);

      // Schedule notifications for remaining prayers
      if (remainingPrayers.length > 0) {
        schedulePrayerNotifications(remainingPrayers);
      }
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
} = calendarSlice.actions;

export default calendarSlice.reducer;
