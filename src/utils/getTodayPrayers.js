import moment from 'moment';
import calendarData from '../calendar.json'; // Adjust the path to your calendar data file

// Define function to fetch today's prayers
async function getTodaysPrayers() {
  const todayDate = moment().format('DD/MM'); // Format date to match calendar data format
  
  // Find today's entry in the calendar data
  const todayEntry = calendarData.find(entry => entry.date === todayDate);
  
  if (!todayEntry) {
    console.error('No prayer times found for today in calendar data.');
    return [];
  }

  // Define the prayer times you want to include
  const prayers = [
    {name: 'Fajr', time: todayEntry.sehri_end},
    {name: 'Zuhr', time: todayEntry.zuhar_begin},
    {name: 'Asr', time: todayEntry.asar_begin},
    {name: 'Maghrib', time: todayEntry.magrib_jamat},
    {name: 'Isha', time: todayEntry.isha_begin},
  ];
  
  return prayers;
}

export default getTodaysPrayers;
