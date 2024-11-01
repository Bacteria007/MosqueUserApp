import moment from 'moment';

// Helper function to prepare individual day's prayer data
const preparePrayerData = (data) => [
  { name: 'Fajar', time: data.sehri_end },
  { name: 'Zuhar', time: data.zuhar_begin },
  { name: 'Asar', time: data.asar_begin },
  { name: 'Magrib', time: data.magrib_jamat },
  { name: 'Isha', time: data.isha_begin },
];

// Function to transform all prayer data for future scheduling
const transformFuturePrayers = (prayers) => {
  return prayers.map((prayer) => ({
    date: moment(prayer.date).format('YYYY-MM-DD'), // Ensure consistent date format
    prayerTimes: preparePrayerData(prayer), // Structure prayer times
  }));
};

export default transformFuturePrayers;
