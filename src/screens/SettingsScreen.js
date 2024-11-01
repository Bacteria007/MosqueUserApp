import React, { useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { VolumeManager, RINGER_MODE, setRingerMode } from 'react-native-volume-manager';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { cancelAllScheduledNotifications, schedulePrayerAlarms } from '../utils/PrayerAlarm';
import { setAutoSilentEnabled, setReminderEnabled } from '../reducers/notificationSlice';
import { getNextPrayerData } from '../reducers/calendarSlice';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import fonts from '../assets/fonts/MyFonts';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AppHeader from '../components/headers/AppHeader';

const SettingsScreen = () => {
  const isReminderEnabled = useSelector(state => state.notification.isReminderEnabled);
  const isAutoSilentEnabled = useSelector(state => state.notification.isAutoSilentEnabled);
  const nextPrayer = useSelector(state => state.calendar.nextPrayer);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    // Get the next prayer data upon component mount
    dispatch(getNextPrayerData());
  }, [dispatch]);

  const scheduleSilentModeForNextPrayer = () => {
    if (!nextPrayer) return;

    const prayerTime = moment(nextPrayer.time, 'HH:mm');
    if (prayerTime.isAfter(moment())) {
      const timeUntilPrayer = prayerTime.diff(moment());
      console.log(`Scheduling silent mode for ${nextPrayer.name} in ${timeUntilPrayer}ms`);

      BackgroundTimer.setTimeout(() => enableSilentMode(nextPrayer), timeUntilPrayer);
    }
  };

  const enableSilentMode = async (prayer) => {
    if (!(await requestDoNotDisturbPermission())) return;

    console.log(`Enabling silent mode for ${prayer.name}`);
    setRingerMode(RINGER_MODE.silent);
    dispatch(setAutoSilentEnabled(true));

    BackgroundTimer.setTimeout(() => {
      setRingerMode(RINGER_MODE.normal);
      dispatch(setAutoSilentEnabled(false));
      console.log(`Reverting to normal mode for ${prayer.name}`);
    }, 15 * 60 * 1000); // 15 minutes
  };

  const requestDoNotDisturbPermission = async () => {
    try {
      const hasPermission = await VolumeManager.checkDndAccess();
      if (!hasPermission) {
        Alert.alert(
          'Do Not Disturb Permission',
          'This app requires permission to modify Do Not Disturb settings.',
          [{ text: 'OK', onPress: () => VolumeManager.requestDndAccess() }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking DND permission:', error);
      return false;
    }
  };

  const handleSilentModeSwitch = async (value) => {
    if (!(await requestDoNotDisturbPermission())) {
      dispatch(setAutoSilentEnabled(false));
      return;
    }
    dispatch(setAutoSilentEnabled(value));
    if (value) scheduleSilentModeForNextPrayer();
  };

  const handleReminderSwitch = (value) => {
    dispatch(setReminderEnabled(value));
    if (value && nextPrayer) {
      schedulePrayerAlarms([nextPrayer]);
    } else {
      cancelAllScheduledNotifications();
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.reset({ index: 0, routes: [{ name: 'AuthNavigator', params: { screen: 'Login' } }] });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={CommonStyles.container}>
      <TransparentStatusbar />
      <AppHeader />
      <MainScreensHeader title="Settings" />
      <View style={[CommonStyles.authBottomConatiner, { marginTop: 20 }]}>
        <View style={styles.alarmContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.alarmTitle}>Prayer Reminder Notification</Text>
            <Text style={styles.alarmDesc}>
              Turn on Prayer Notifications to stay updated with the mosque’s prayer times.
            </Text>
          </View>
          <Switch value={isReminderEnabled} onValueChange={handleReminderSwitch} />
        </View>
        <View style={styles.alarmContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.alarmTitle}>Prayer Time Auto Silent</Text>
            <Text style={styles.alarmDesc}>
              Automatically silence your mobile at prayer time and stay silent for 15 minutes.
            </Text>
          </View>
          <Switch value={isAutoSilentEnabled} onValueChange={handleSilentModeSwitch} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alarmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  alarmTitle: { fontSize: 14, fontFamily: fonts.semibold, color: colors.black },
  alarmDesc: { fontSize: 12, fontFamily: fonts.normal, color: colors.black },
});

export default SettingsScreen;
