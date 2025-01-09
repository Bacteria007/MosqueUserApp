import React, {useEffect, useState} from 'react';
import {View, Text, Switch, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  VolumeManager,
  RINGER_MODE,
  setRingerMode,
} from 'react-native-volume-manager';
import BackgroundTimer from 'react-native-background-timer';
import BackgroundFetch from 'react-native-background-fetch';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {
  setAutoSilentEnabled,
  setReminderEnabled,
} from '../reducers/notificationSlice';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import fonts from '../assets/fonts/MyFonts';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AppHeader from '../components/headers/AppHeader';
import calendarData from '../calendar.json';
import {
  cancelAllScheduledNotifications,
  schedulePrayerAlarms,
} from '../utils/PrayerAlarm';
import getTodaysPrayers from '../utils/getTodayPrayers';

const SettingsScreen = () => {
  const isReminderEnabled = useSelector(
    state => state.notification.isReminderEnabled,
  );
  const isAutoSilentEnabled = useSelector(
    state => state.notification.isAutoSilentEnabled,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [todayPrayers, setTodayPrayers] = useState([]);
  const [nextPrayer, setNextPrayer] = useState(null);

  useEffect(() => {
    loadTodayPrayers();
    calculateNextPrayer();
  }, []);

  const loadTodayPrayers = () => {
    const todayDate = moment().format('DD/MM');
    const todayPrayerData = calendarData.find(item => item.date === todayDate);

    if (todayPrayerData) {
      const prayers = [
        {
          name: 'Fajr',
          time: todayPrayerData?.sehri_end,
          jamatTime: todayPrayerData.fajar_jamat,
        },
        {
          name: 'Zuhr',
          time: todayPrayerData?.zuhar_begin,
          jamatTime: todayPrayerData.zuhar_jamat,
        },
        {
          name: 'Asr',
          time: todayPrayerData?.asar_begin,
          jamatTime: todayPrayerData.asar_jamat,
        },
        {
          name: 'Maghrib',
          time: todayPrayerData?.magrib_jamat,
          jamatTime: todayPrayerData.magrib_jamat,
        },
        {
          name: 'Isha',
          time: todayPrayerData?.isha_begin,
          jamatTime: todayPrayerData.isha_jamat,
        },
      ].filter(prayer => prayer.time);
      setTodayPrayers(prayers);
    } else {
      console.error('No prayer data found for today');
    }
  };

  const calculateNextPrayer = () => {
    const currentTime = moment();
    const next = todayPrayers?.find(prayer =>
      moment(prayer.time, 'HH:mm').isAfter(currentTime),
    );
    setNextPrayer(next || todayPrayers[0]);
  };

  const scheduleSilentModeForNextPrayer = () => {
    if (!nextPrayer) return;
    const prayerTime = moment(nextPrayer.time, 'HH:mm');
    if (prayerTime.isAfter(moment())) {
      const timeUntilPrayer = prayerTime.diff(moment());
      BackgroundTimer.setTimeout(
        () => enableSilentMode(nextPrayer),
        timeUntilPrayer,
      );
    }
  };

  const enableSilentMode = async prayer => {
    const permissionGranted = await requestDoNotDisturbPermission();
    if (!permissionGranted) return;
    setRingerMode(RINGER_MODE.silent).then(() => {
      dispatch(setAutoSilentEnabled(true));
    });
    BackgroundTimer.setTimeout(() => {
      setRingerMode(RINGER_MODE.normal).then(() => {
        dispatch(setAutoSilentEnabled(false));
      });
    }, 15 * 60 * 1000); // 15 minutes
  };

  const requestDoNotDisturbPermission = async () => {
    try {
      const hasPermission = await VolumeManager.checkDndAccess();
      if (!hasPermission) {
        Alert.alert(
          'Do Not Disturb Permission',
          'This app requires permission to modify Do Not Disturb settings.',
          [{text: 'OK', onPress: () => VolumeManager.requestDndAccess()}],
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking DND permission:', error);
      return false;
    }
  };

  const handleSilentModeSwitch = async value => {
    if (!(await requestDoNotDisturbPermission())) {
      dispatch(setAutoSilentEnabled(false));
      return;
    }
    dispatch(setAutoSilentEnabled(value));
    if (value) scheduleSilentModeForNextPrayer();
  };

  const handleReminderSwitch = async value => {
    dispatch(setReminderEnabled(value));

    if (value) { 
      // behind this is a long story
      // const prayers = await getTodaysPrayers();
      // console.log("settings prayers",prayers);

      // 
      // schedulePrayerAlarms(prayers);
    } else {
      cancelAllScheduledNotifications();
      BackgroundFetch.stop();
    }
  };

  return (
    <View style={CommonStyles.container}>
      <TransparentStatusbar />
      <AppHeader />
      <MainScreensHeader title="Settings" />
      <View style={[CommonStyles.authBottomConatiner, {marginTop: 20}]}>
        <View style={styles.alarmContainer}>
          <View style={{flex: 1}}>
            <Text style={styles.alarmTitle}>Prayer Reminder Notification</Text>
            <Text style={styles.alarmDesc}>
              Turn on Prayer Notifications to stay updated with the mosque’s
              prayer times.
            </Text>
          </View>
          <Switch
            value={isReminderEnabled}
            onValueChange={handleReminderSwitch}
          />
        </View>
        <View style={styles.alarmContainer}>
          <View style={{flex: 1}}>
            <Text style={styles.alarmTitle}>Prayer Time Auto Silent</Text>
            <Text style={styles.alarmDesc}>
              Automatically silence your mobile at prayer time and stay silent
              for 15 minutes.
            </Text>
          </View>
          <Switch
            value={isAutoSilentEnabled}
            onValueChange={handleSilentModeSwitch}
          />
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
  alarmTitle: {fontSize: 14, fontFamily: fonts.semibold, color: colors.black},
  alarmDesc: {fontSize: 12, fontFamily: fonts.normal, color: colors.black},
});

export default SettingsScreen;
