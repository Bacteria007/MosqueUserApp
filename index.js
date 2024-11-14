import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import CronJob from 'react-native-cron-job';
import moment from 'moment';
import getTodaysPrayers from './src/utils/getTodayPrayers';

// // Define the cron job task to schedule today's prayer alarms
// const CronJobTask = async () => {
//   const prayers = await getTodaysPrayers();
//   const today = moment().format('DD MMMM, YYYY'); 
  
//   await schedulePrayerAlarms1(prayers, today); 
//   CronJob.completeTask();
// };

// AppRegistry.registerHeadlessTask('CRONJOB', () => CronJobTask);
AppRegistry.registerComponent(appName, () => App);
// CronJob.startCronJob(3, 0);

