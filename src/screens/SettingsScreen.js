import React, {useState, useEffect} from 'react';
import {View, Text, Switch, StyleSheet, Alert} from 'react-native';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import fonts from '../assets/fonts/MyFonts';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../reducers/authSlice';
import {
  VolumeManager,
  RINGER_MODE,
  setRingerMode,
} from 'react-native-volume-manager';
import {
  cancelAllNotifications,
  createNotificationChannel,
  schedulePrayerNotifications,
} from '../utils/PrayerRemiders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import WhiteStatusbar from '../components/statusbar/WhiteStatusbar';
import AppHeader from '../components/headers/AppHeader';

const SettingsScreen = () => {
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [isSilentModeEnabled, setIsSilentModeEnabled] = useState(false);
  const todayPrayers = useSelector(state => state.calendar.todayPrayers);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    const fetchRingerMode = async () => {
      try {
        const currentMode = await VolumeManager.getRingerMode();
        setIsSilentModeEnabled(currentMode === RINGER_MODE.silent);
      } catch (error) {
        console.error('Error fetching ringer mode:', error);
      }
    };

    fetchRingerMode();
    // createNotificationChannel(todayPrayers);
  }, []);

  const requestDoNotDisturbPermission = async () => {
    try {
      const hasPermission = await VolumeManager.checkDndAccess();
      if (!hasPermission) {
        Alert.alert(
          'Do Not Disturb Permission',
          'This app requires permission to modify Do Not Disturb settings.',
          [
            {
              text: 'OK',
              onPress: () => VolumeManager.requestDndAccess(),
            },
          ],
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking Do Not Disturb permission:', error);
      return false;
    }
  };

  const handleSilentModeSwitch = async value => {
    const hasPermission = await requestDoNotDisturbPermission();
    if (!hasPermission) {
      setIsSilentModeEnabled(false);
      return;
    }
    setIsSilentModeEnabled(value);

    const currentMode = await VolumeManager.getRingerMode();
    setRingerMode(value ? RINGER_MODE.silent : RINGER_MODE.normal);
  };

  const handleReminderSwitch = value => {
    setIsReminderEnabled(value);
    if (value) {
      // Call function to schedule notifications
      // schedulePrayerNotifications(todayPrayers);
    } else {
      cancelAllNotifications();
    }
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{name: 'AuthNavigator', params: {screen: 'Login'}}],
      });

      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={CommonStyles.container}>
      <TransparentStatusbar />
      <AppHeader />

      <MainScreensHeader title={'Settings'} />
      <View style={[CommonStyles.authBottomConatiner, {marginTop: 20}]}>
        <View style={styles.alarmContainer}>
          <View style={{flex: 1}}>
            <Text style={styles.alarmTitle}>Prayer Reminder Notification</Text>
            <Text style={styles.alarmDesc}>
              Turn on Jamat Notifications to stay updated with the mosque’s
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
              Automatically silence your mobile during Jamat to avoid
              distractions.
            </Text>
          </View>
          <Switch
            value={isSilentModeEnabled}
            onValueChange={handleSilentModeSwitch}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 30}}>
          <Text onPress={handleLogout} style={styles.logout}>
            Logout
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logout: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.semibold,
    textAlign: 'center',
  },
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
