// LocationPermission.js
import {Alert, Platform, Linking, PermissionsAndroid} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

export const checkAndRequestLocationPermission = async () => {

     if (Platform.OS === 'android') {
       const permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
   
       if (permissionStatus === RESULTS.GRANTED) {
         checkIfLocationServicesEnabled(); // If permission granted, check GPS
       } else {
         await requestLocationPermission(); // Request permission if not granted
       }
     } else if (Platform.OS === 'ios') {
       const permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
   
       if (permissionStatus === RESULTS.GRANTED) {
         checkIfLocationServicesEnabled(); // If permission granted, check GPS
       } else {
         console.log('Location permission not granted on iOS');
         Alert.alert(
           'Location Permission Required',
           'We need access to your location to show relevant information.',
           [
             { text: 'Cancel', style: 'cancel' },
             { text: 'Open Settings', onPress: () => Linking.openSettings() },
           ],
         );
       }
     }
 
};

const checkIfLocationServicesEnabled = async () => {
  const isLocationEnabled = await DeviceInfo.isLocationEnabled();
  if (!isLocationEnabled) {
    showEnableLocationAlert();
  }
};

const requestLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message:
        'We need access to your location to show you relevant information.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    checkIfLocationServicesEnabled();
  }
};

const showEnableLocationAlert = () => {
  Alert.alert(
    'Enable Location',
    'Please enable location services and ensure GPS is on.',
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Enable',
        onPress: () =>
          Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS'),
      },
    ],
  );
};
