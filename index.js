import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import BackgroundFetch from 'react-native-background-fetch';
// import { handleBackgroundTask } from './src/utils/backgroundTask';

// const HeadlessTask = async taskId => {
//   console.log('[BackgroundFetch HeadlessTask] Start:', taskId);
//   await handleBackgroundTask();
//   BackgroundFetch.finish(taskId);
// };

// BackgroundFetch.registerHeadlessTask(HeadlessTask);

AppRegistry.registerComponent(appName, () => App);