import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Switch,
  FlatList,
  StyleSheet,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import fonts from '../assets/fonts/MyFonts';
import MyImages from '../assets/images/MyImages';
import {Icons} from '../assets/icons/Icons';
import GradientButton from '../components/buttons/GradientButton';
import PushNotification from 'react-native-push-notification';

const SettingsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlarmId, setSelectedAlarmId] = useState(null); // Track the selected alarm ID
  const [selectedDuration, setSelectedDuration] = useState('default');
  const [selectedSilentDuration, setSelectedSilentDuration] =
    useState('default');
  const [selectedRingtone, setSelectedRingtone] = useState('DUA');
  const closeDonationModal = () => setIsModalVisible(false);

  const scheduleAlarm =() => {
    console.log('alarm caled');

    PushNotification.localNotificationSchedule({
      // The message to display
      message: "It's time for the prayer!",

      // Set the scheduled time (must be a future time)
      date: new Date(Date.now() + 30 * 1000), // in 60 secs
      actions: ['OK'],

      // Customize the notification sound
      soundName: 'alarm_sound.mp3', // Add your own custom sound file

      // Configure for Android
      allowWhileIdle: true, // Shows the notification even if the phone is in idle mode
      repeatType: 'day',
      repeatTime: 2,
      // Android-specific configurations
      importance: 'high',
      vibrate: true,
      vibration: 300,
      priority: 'max',
      channelId: 'prayer_reminder', // Ensure this matches your channel ID
    });
  };
  scheduleAlarm()
  const ringtones = {
    DUA: 'Dua',
    AZAN: 'Azan',
    DEFAULT: 'default',
  };
  const alarmDurations = {
    '15 min': '15 min',
    '30 min': '30 min',
    default: 'default',
  };
  const silentDurations = {
    '15 min': '15 min',
    '30 min': '30 min',
    default: 'default',
  };
  const [alarmStates, setAlarmStates] = useState({
    1: false, // Jamat alarm
    2: false, // Silent alarm
    3: false, // Prayer Time Auto Silent
  });
  const toggleAlarm = id => {
    setAlarmStates(prevState => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],
      };

      // Show modal for any item when it's toggled on
      if (newState[id]) {
        setSelectedAlarmId(id); // Set the selected alarm ID
        setIsModalVisible(true);
      } else {
        closeDonationModal();
      }

      return newState;
    });
  };

  const alarms = [
    {
      id: 1,
      name: 'Prayer Reminder Notification',
      desc: 'Turn on Jamat Notifications to stay updated with the mosque’s prayer times and never miss a congregation',
    },
    {
      id: 2,
      name: 'Prayer Reminder Ringtones',
      desc: 'Set your favorite ringtone for the prayer reminder notification',
    },
    {
      id: 3,
      name: 'Prayer Time Auto Silent',
      desc: 'Automatically silence your mobile for specific time during Jamat to avoid any distractions.',
    },
  ];

  const renderAlarmItem = ({item}) => (
    <View style={styles.alarmContainer}>
      <View style={{flex: 1}}>
        <Text style={styles.alarmTitle}>{item.name}</Text>
        <Text style={styles.alarmDesc}>{item.desc}</Text>
      </View>
      <Switch
        trackColor={{false: colors.tab_inactive, true: colors.secondary}}
        thumbColor={alarmStates[item.id] ? colors.secondary : colors.white}
        ios_backgroundColor={colors.primary}
        onValueChange={() => toggleAlarm(item.id)}
        value={alarmStates[item.id]}
      />
    </View>
  );

  const renderRadioButton = (item, setter, selectedValue) => (
    <Pressable
      onPress={() => setter(item)}
      style={[
        styles.radioButton,
        selectedValue === item && styles.radioButtonSelected,
      ]}>
      {selectedValue === item ? (
        <Icons.Ionicons
          name={'radio-button-on'}
          color={colors.white}
          size={20}
        />
      ) : (
        <Icons.Ionicons
          name={'radio-button-off'}
          color={colors.white}
          size={20}
        />
      )}
      <Text style={styles.radioButtonText}>{item}</Text>
    </Pressable>
  );

  const getModalContent = () => {
    switch (selectedAlarmId) {
      case 1:
        return (
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={styles.modalTitle}>Prayer Reminder Before</Text>
            <View style={{flexDirection: 'row', gap: 5}}>
              {Object.keys(alarmDurations).map(key =>
                renderRadioButton(
                  alarmDurations[key],
                  setSelectedDuration,
                  selectedDuration,
                ),
              )}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{width: '90%', alignItems: 'center'}}>
            <Text style={styles.modalTitle}>Select Ringtone</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              {Object.keys(ringtones).map(key =>
                renderRadioButton(
                  ringtones[key],
                  setSelectedRingtone,
                  selectedRingtone,
                ),
              )}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={{width: '90%', alignItems: 'center'}}>
            <Text style={styles.modalTitle}>Auto Silent For</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              {Object.keys(silentDurations).map(key =>
                renderRadioButton(
                  silentDurations[key],
                  setSelectedSilentDuration,
                  selectedSilentDuration,
                ),
              )}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[CommonStyles.container]}>
      <MainScreensHeader title={'Settings'} />
      <View style={[CommonStyles.authBottomConatiner, {marginTop: 20}]}>
        <FlatList
          data={alarms}
          renderItem={renderAlarmItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      {/* Modal for Alarm Settings */}
      <Modal
        statusBarTranslucent
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDonationModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={MyImages.masjid}
              style={{
                height: 60,
                width: 60,
                borderRadius: 99,
                resizeMode: 'cover',
              }}
            />
            {getModalContent()}
            <GradientButton
              title={'OK'}
              onPress={closeDonationModal}
              style={{width: '40%', height: 40, marginTop: 10}}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  alarmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  alarmTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  alarmDesc: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.white,
    textAlign: 'justify',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.secondary,
    marginBottom: 5,
    marginTop: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1,
  },
  radioButtonSelected: {
    // backgroundColor: colors.secondary,
  },
  radioButtonText: {
    color: colors.white,
    marginLeft: 2,
    fontSize: 14,
  },
});

export default SettingsScreen;
