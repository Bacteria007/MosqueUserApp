import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { VolumeManager, RINGER_MODE, setRingerMode } from 'react-native-volume-manager';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { cancelAllScheduledNotifications, schedulePrayerAlarms, scheduleWeeklyPrayerAlarms } from '../utils/PrayerAlarm';
import { setReminderEnabled } from '../reducers/notificationSlice';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import fonts from '../assets/fonts/MyFonts';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AppHeader from '../components/headers/AppHeader';

const SettingsScreen = () => {
  const [isSilentModeEnabled, setIsSilentModeEnabled] = useState(false);
  const todayPrayers = useSelector(state => state.calendar.todayPrayers);
  const weeklyPrayerTimes = useSelector(state => state.calendar.weeklyPrayerTimes);
  const isReminderEnabled = useSelector(state => state.notification.isReminderEnabled);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    fetchInitialRingerMode();
  }, []);

  const fetchInitialRingerMode = async () => {
    try {
      const currentMode = await VolumeManager.getRingerMode();
      setIsSilentModeEnabled(currentMode === RINGER_MODE.silent);
    } catch (error) {
      console.error('Error fetching ringer mode:', error);
    }
  };

  const scheduleSilentModeForAllPrayers = () => {
    todayPrayers.forEach(prayer => {
      const prayerTime = moment(prayer.time, 'HH:mm'); // Exact prayer time

      if (prayerTime.isAfter(moment())) {
        const timeUntilPrayer = prayerTime.diff(moment());
        console.log(`Scheduling silent mode for ${prayer.name} in ${timeUntilPrayer}ms`);

        // Schedule silent mode to start at the prayer time
        BackgroundTimer.setTimeout(() => enableSilentMode(prayer), timeUntilPrayer);
      }
    });
  };

  const enableSilentMode = async (prayer) => {
    const hasPermission = await requestDoNotDisturbPermission();
    if (!hasPermission) return;

    console.log(`Enabling silent mode for ${prayer.name}`);
    setRingerMode(RINGER_MODE.silent);
    setIsSilentModeEnabled(true);

    const silentDuration = 15 * 60 * 1000; // 15 minutes in milliseconds

    // Revert to normal mode after 15 minutes
    BackgroundTimer.setTimeout(() => {
      setRingerMode(RINGER_MODE.normal);
      setIsSilentModeEnabled(false);
      console.log(`Reverting to normal mode for ${prayer.name}`);
    }, silentDuration);
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
    const hasPermission = await requestDoNotDisturbPermission();
    if (!hasPermission) {
      setIsSilentModeEnabled(false);
      return;
    }
    setIsSilentModeEnabled(value);
    if (value) {
      scheduleSilentModeForAllPrayers(); // Schedule silent mode when switch is ON
    }
  };

  // useEffect(() => {
  //   if (isReminderEnabled) {
  //     scheduleAlarmsForNext7Days(weeklyPrayerTimes);
  //   }
  // }, [weeklyPrayerTimes, isReminderEnabled]);
  
  const preparePrayerData = data => [
    {name: 'Fajar', time: data.fajar_jamat},
    {name: 'Zuhar', time: data.zuhar_jamat},
    {name: 'Asar', time: data.asar_jamat},
    {name: 'Magrib', time: data.magrib_jamat},
    {name: 'Isha', time: data.isha_jamat},
  ];

  const scheduleAlarmsForNext7Days = (prayerTimes) => {
    prayerTimes.forEach((day) => {
      const prayers = preparePrayerData(day);
      prayers.forEach((prayer) => {
        schedulePrayerAlarms(prayer);
      });
    });
  };
  
  // Call it after fetching and filtering
  
  const handleReminderSwitch = (value) => {
    dispatch(setReminderEnabled(value));
    if (value) {
      // schedulePrayerAlarms(todayPrayers);
      scheduleAlarmsForNext7Days(weeklyPrayerTimes);
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
          <Switch value={isSilentModeEnabled} onValueChange={handleSilentModeSwitch} />
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
