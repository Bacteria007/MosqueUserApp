// LocationPermission.js
import {Alert, Platform, Linking, PermissionsAndroid} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

export const checkAndRequestLocationPermission = async () => {
  const permissionStatus = await check(
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  );

  if (permissionStatus === RESULTS.GRANTED) {
    checkIfLocationServicesEnabled();
  } else {
    requestLocationPermission();
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
