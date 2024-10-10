import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Switch,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import fonts from '../assets/fonts/MyFonts';
import {Icons} from '../assets/icons/Icons';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import ReactNativeModal from 'react-native-modal';
import {
  useRingerMode,
  RINGER_MODE,
  RingerModeType,
} from 'react-native-volume-manager';
import { appName } from '../services/constants';

const modeText = {
  [RINGER_MODE.silent]: 'Silent',
  [RINGER_MODE.normal]: 'Normal',
  [RINGER_MODE.vibrate]: 'Vibrate',
};
let alarm;
const SettingsScreen = () => {
  const {mode, error, setMode} = useRingerMode();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlarmId, setSelectedAlarmId] = useState(null); // Track the selected alarm ID
  const [selectedDuration, setSelectedDuration] = useState('default');
  const [selectedSilentDuration, setSelectedSilentDuration] =
    useState('default');
  const [selectedRingtone, setSelectedRingtone] = useState('DUA');
  const closeDonationModal = () => setIsModalVisible(false);

  // Function to play the alarm sound in an infinite loop
  const playAlarmSound = () => {
    const alarm = new Sound('alarm_sound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }

      alarm.setNumberOfLoops(0); // Infinite loop to play continuously
      alarm.play(success => {
        if (!success) {
          console.error('Failed to play sound');
        }
      });
    });
  };

  // Function to stop the alarm sound
  const stopAlarmSound = () => {
    if (alarm) {
      alarm.stop(() => {
        alarm.release(); // Release sound resource when finished
      });
    }
  };

  const scheduleAlarm = () => {
    console.log('alarm caled');

    PushNotification.localNotificationSchedule({
      message: `${appName}`,
      date: new Date(Date.now() + 1 * 1000),
      soundName: 'azan.mp3',
      allowWhileIdle: true,
      importance: 'high',
      vibrate: true,
      vibration: 300,
      priority: 'max',
      channelId: 'prayer_reminder',
      // ongoing: true, // Ensures it stays active
      autoCancel: false, 
    });
  };

  const [isSilent, setIsSilent] = useState(false);

  const handlePrayerReminderNotification = () => {
    console.log('Prayer Reminder Notification set for:', selectedDuration);
    // Add your notification scheduling logic here
  };

  const handleRingtoneSelection = () => {
    console.log('Ringtone selected:', selectedRingtone);
    // Add your ringtone selection logic here
  };
  // Function to execute the appropriate handler based on selectedAlarmId
  const handleModalOkPress = () => {
    switch (selectedAlarmId) {
      case 1:
        handlePrayerReminderNotification();
        break;
      case 2:
        handleRingtoneSelection();
        break;
      case 3:
        handleSilentModeSelection();
        break;
      default:
        break;
    }
    closeDonationModal(); // Close modal after handling
  };
  // Function to silent the phone for selected duration
  const enableSilentModeForDuration = duration => {
    // Convert the selected duration to milliseconds
    const durationInMillis = duration * 60 * 1000;

    // Activate silent mode
    setIsSilent(true);

    setTimeout(() => {
      setIsSilent(false);
      console.log(`Silent mode deactivated after ${duration} minutes`);
    }, durationInMillis);
  };

  // Handle OK button click in the modal for Silent Mode
  const handleSilentModeSelection = () => {
    const duration = selectedSilentDuration === '15 min' ? 15 : 30;
    enableSilentModeForDuration(duration); // Silent for 15 or 30 minutes
  };

  useEffect(() => {
    scheduleAlarm();
  }, []);
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
        trackColor={{false: colors.tab_inactive, true: colors.primary}}
        thumbColor={alarmStates[item.id] ? colors.primary : colors.white}
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
          <View style={{width: '100%', alignItems: 'flex-start'}}>
            <Text style={styles.modalTitle}>Prayer Reminder Before</Text>
            <View style={{flexDirection: 'column', gap: 5}}>
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
          <View style={{width: '90%', alignItems: 'flex-start'}}>
            <Text style={styles.modalTitle}>Select Ringtone</Text>
            <View style={{flexDirection: 'column', gap: 5}}>
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
          <View style={{width: '90%', alignItems: 'flex-start'}}>
            <Text style={styles.modalTitle}>Auto Silent For</Text>
            <View style={{flexDirection: 'column', gap: 5}}>
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
      <ReactNativeModal
        statusBarTranslucent
        visible={isModalVisible}
        style={{margin: 0, flex: 1}}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onDismiss={closeDonationModal}
        onBackdropPress={closeDonationModal}
        onBackButtonPress={closeDonationModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {getModalContent()}
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Pressable onPress={closeDonationModal} style={styles.okBtn}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleModalOkPress} style={styles.okBtn}>
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ReactNativeModal>
    </View>
  );
};

const styles = StyleSheet.create({
  okBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light_white,
    borderRadius: 10,
    paddingVertical: 8,
    width: '40%',
    marginTop: 10,
  },

  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.medium,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  alarmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  alarmTitle: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  alarmDesc: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.black,
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
    color: colors.white,
    marginBottom: 5,
    marginTop: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    // flex: 1,
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
