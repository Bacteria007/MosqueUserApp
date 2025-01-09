import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { persistor, store } from './src/store/store';
import { STRIPE_PUBLISHABLE_KEY } from '@env';
import Toast from 'react-native-toast-message';
import { PersistGate } from 'redux-persist/integration/react';
// import BackgroundFetch from 'react-native-background-fetch';
// import { handleBackgroundTask } from './src/utils/backgroundTask';

LogBox.ignoreAllLogs();

const App = () => {
  // useEffect(() => {
  //   const configureBackgroundFetch = () => {
  //     BackgroundFetch.configure(
  //       {
  //         minimumFetchInterval: 15, // 15 minutes
  //         stopOnTerminate: false,
  //         startOnBoot: true,
  //         enableHeadless: true,
  //       },
  //       async taskId => {
  //         console.log('[BackgroundFetch] Task executed:', taskId);
  //         await handleBackgroundTask();
  //         BackgroundFetch.finish(taskId);
  //       },
  //       error => {
  //         console.error('[BackgroundFetch] Failed to configure:', error);
  //       },
  //     );

  //     BackgroundFetch.start();
  //   };

  //   configureBackgroundFetch();
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <AppNavigator />
            <Toast />
          </StripeProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
