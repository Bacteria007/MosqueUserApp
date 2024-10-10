import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
  Pressable,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import ApiService from '../services/api';
import {appName, GET, prayerTimesURL} from '../services/constants';
import PushNotification from 'react-native-push-notification';
import MyImages from '../assets/images/MyImages';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import CommonStyles from '../assets/styles/CommonStyles';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import moment from 'moment'; // Import moment for date formatting
import RNPickerSelect from 'react-native-picker-select'; // Use RNPickerSelect instead of Picker
import LottieView from 'lottie-react-native';
import {Icons} from '../assets/icons/Icons';
import WhiteStatusbar from '../components/statusbar/WhiteStatusbar';
import DateTimePicker from '@react-native-community/datetimepicker';

const PrayerTimesScreen = () => {
  const dateformate = 'DD MMMM, YYYY';
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format(dateformate),
  ); // Default to today
  const [todayPrayers, setTodayPrayers] = useState({});
  const [filteredPrayerTimes, setFilteredPrayerTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingPrayer, setUpcomingPrayer] = useState({});
  const [nextPrayer, setNextPrayer] = useState({});
  const [date, setDate] = useState(new Date()); // Current selected date for the picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
 
   const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(false); // Hide the picker
    setDate(currentDate);
    setSelectedDate(moment(currentDate).format(dateformate)); // Format date as needed
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    filterTodayPrayers();
    filterPrayerTimes();
  }, [selectedDate, prayerTimes]);

  useEffect(() => {
    if (todayPrayers) {
      calculateUpcomingAndNextPrayers(todayPrayers); // Upcoming and next prayers based on today's prayers
    }
  }, [todayPrayers]);

  useEffect(() => {
    // Request notification permission when the screen is loaded
    requestNotificationPermission();
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      const response = await ApiService({method: GET, url: prayerTimesURL});
      setPrayerTimes(response.data);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
    setLoading(false);
  };

  const filterTodayPrayers = () => {
    const today = moment().format(dateformate);
    const todayTimes = prayerTimes.find(
      item => moment(item.date).format(dateformate) === today,
    );
    setTodayPrayers(todayTimes || {});
  };

  const filterPrayerTimes = () => {
    const filteredTimes = prayerTimes.find(
      item => moment(item.date).format(dateformate) === selectedDate,
    );
    setFilteredPrayerTimes(filteredTimes || {});
  };

  const calculateUpcomingAndNextPrayers = times => {
    if (!times) return;

    const prayerTimes = [
      {name: 'Fajr', time: times.fajar_jamat},
      {name: 'Dhuhr', time: times.zuhar_jamat},
      {name: 'Asr', time: times.asar_jamat},
      {name: 'Maghrib', time: times.magrib_jamat},
      {name: 'Isha', time: times.isha_jamat},
    ];

    const currentTime = moment();
    let upcoming, next;
    for (let i = 0; i < prayerTimes.length; i++) {
      const prayerTime = moment(prayerTimes[i].time, 'HH:mm');
      if (prayerTime.isAfter(currentTime)) {
        upcoming = prayerTimes[i];
        next = prayerTimes[i + 1] || prayerTimes[0]; // Wrap around to Fajr if no next prayer
        break;
      }
    }

    setUpcomingPrayer(upcoming || prayerTimes[0]); // Default to Fajr if no upcoming prayer found
    setNextPrayer(next || prayerTimes[1]); // Default to Dhuhr if no next prayer found
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app requires permission to send alarms.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
          // Now create the notification channel and schedule notifications
          createNotificationChannel();
          schedulePrayerNotifications(todayPrayers);
        } else {
          console.log('Notification permission denied');
          Alert.alert(
            'Permission required',
            'Notification permission is required to receive prayer alarms.',
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      PushNotification.requestPermissions().then(permission => {
        if (permission.alert || permission.sound || permission.badge) {
          console.log('Notification permission granted');
          // Now create the notification channel and schedule notifications
          createNotificationChannel();
          schedulePrayerNotifications(todayPrayers);
        } else {
          console.log('Notification permission denied');
          Alert.alert(
            'Permission required',
            'Notification permission is required to receive alerts.',
          );
        }
      });
    }
  };

  const createNotificationChannel = () => {
    console.log('Creating notification channel...');
    PushNotification.createChannel(
      {
        channelId: 'prayer_reminder',
        channelName: 'Prayer Alarm',
        playSound: true,
        soundName: 'azan.mp3',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Channel created successfully: ${created}`),
    );
  };

  const schedulePrayerNotifications = times => {
    if (!times) return;

    const prayerNames = [
      'fajar_jamat',
      'zuhar_jamat',
      'asar_jamat',
      'magrib_jamat',
      'isha_jamat',
    ];
    const prayerLabels = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    prayerNames.forEach((prayer, index) => {
      const timeString = times[prayer];
      if (timeString) {
        const now = new Date();
        const alarmTime = new Date(now);
        const [hour, minute] = timeString.split(':');
        alarmTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

        // Only schedule the alarm if the prayer time is in the future today
        if (alarmTime > now) {
          PushNotification.localNotificationSchedule({
            id: prayerLabels[index], // Use a unique id for each prayer
            channelId: 'prayer_reminder',
            message: `${prayerLabels[index]} prayer!`,
            date: alarmTime,
            playSound: true,
            soundName: 'azan.mp3',
            allowWhileIdle: true,
            priority: 'max',
            importance: 'high',
            vibrate: true,
            vibration: 300,
          });

          console.log(
            `Scheduled alarm for ${prayerLabels[index]} at ${alarmTime}`,
          );
        }
      }
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPrayerTimes();
    refreshToToday();
    setRefreshing(false);
  };

  const formatTimeTo12Hour = time => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const formattedHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LottieView
          style={{height: 80, width: 80}}
          source={MyImages.loading1}
          autoPlay
          loop={true}
        />
      </View>
    );
  }

  const pickerItems = prayerTimes.map(item => ({
    label: moment(item.date).format(dateformate),
    value: moment(item.date).format(dateformate),
  }));
  // Function to reset the selected date to today
  const refreshToToday = () => {
    const today = moment().format(dateformate);
    setSelectedDate(today);
    filterTodayPrayers();
  };

  // Logic to conditionally render refresh icon
  const isToday = selectedDate === moment().format(dateformate);

  return (
    <>
      <WhiteStatusbar />
      <View style={CommonStyles.container}>
        <View style={styles.mainCard2}>
          <View style={{justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.mosqueTitle} ellipsizeMode="tail">
              {appName}
            </Text>
            <View>
              <Text style={styles.prayerItemTitle}>
                Next: {upcomingPrayer?.name || ''}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: fonts.semibold,
                }}>
                {formatTimeTo12Hour(upcomingPrayer?.time || '')}
              </Text>
            </View>
          </View>
          <View style={styles.imgCard2}>
            <Image source={MyImages.masjid} style={styles.image} />
          </View>
        </View>
        {/* Date Picker */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 30,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* Date Picker */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}>
            <Pressable
              onPress={showDatePicker}
              style={{flexDirection: 'row', gap: 5}}>
              <Text style={styles.dateText}>{selectedDate}</Text>
              <Icons.AntDesign
                name="caretdown"
                size={20}
                color={colors.lighr_grey}
              />
            </Pressable>
            {!isToday && (
              <Pressable onPress={refreshToToday}>
                <Icons.MaterialCommunityIcons
                  name="refresh"
                  size={22}
                  color={colors.teal}
                />
              </Pressable>
            )}
          </View>

          {isDatePickerVisible && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date(2024, 0, 1)} // January is month 0
              maximumDate={new Date(2024, 11, 31)}
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        {/* Refresh Icon */}

        {/* Prayer Times */}
        <FlatList
          data={filteredPrayerTimes ? [filteredPrayerTimes] : []}
          keyExtractor={item => item._id}
          // ListHeaderComponentStyle={{backgroundColor:'rgba(0, 128, 128, 0.5)',alignItems: 'center', alignSelf: 'center'}}
          ListHeaderComponent={() => (
            <View style={styles.listHeaderItem}>
              <Text style={[styles.headerTitle, {textAlign: 'left'}]}>
                Salah
              </Text>
              <Text style={styles.headerTitle}>Adhan</Text>
              <Text style={styles.headerTitle}>Iqamah</Text>
            </View>
          )}
          renderItem={({item}) => {
            // console.log(item);

            return (
              <>
                <View style={{alignItems: 'center', marginTop: 20}}>
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerText}>Fajr</Text>
                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.sehri_end)}
                    </Text>
                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.fajar_jamat)}
                    </Text>
                  </View>
                  {/* <View style={styles.divider} /> */}
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerText}>Dhuhr</Text>
                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.zuhar_begin)}
                    </Text>
                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.zuhar_jamat)}
                    </Text>
                  </View>
                  {/* <View style={styles.divider} /> */}
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerText}>Asr</Text>

                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.asar_begin)}
                    </Text>
                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.asar_jamat)}
                    </Text>
                  </View>
                  {/* <View style={styles.divider} /> */}
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerText}>Maghrib</Text>

                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.magrib_jamat)}
                    </Text>
                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.magrib_jamat)}
                    </Text>
                  </View>
                  {/* <View style={styles.divider} /> */}
                  <View style={styles.prayerItem}>
                    <Text style={styles.prayerText}>Isha</Text>

                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.isha_begin)}
                    </Text>
                    <Text style={styles.prayerTimeText}>
                      {formatTimeTo12Hour(item?.isha_jamat)}
                    </Text>
                  </View>
                </View>
              </>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.lighr_grey, // Adjust this to match your theme
    marginVertical: 10,
    width: '90%', // or any width you'd like
    alignSelf: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the entire ImageBackground
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
  },
  dateText: {
    fontSize: 18,
    color: colors.lighr_grey,
    fontFamily: fonts.bold,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mainCard: {
    backgroundColor: colors.primary,
    opacity: 1,
    paddingHorizontal: 14,
    paddingTop: 55,
    paddingBottom: 25,
    justifyContent: 'space-between',
    flexDirection: 'row',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  mainCard2: {
    backgroundColor: colors.teal,
    opacity: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    height: 180,
    justifyContent: 'space-between',
    flexDirection: 'row',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
    // borderRadius:20,
    // margin:20
  },
  listHeaderItem: {
    // flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.teal,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 5,
    elevation: 4,
  },
  prayerItem: {
    // flex: 1,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg_clr,
    // height: 140,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: colors.teal,
    // opacity: 0.8,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 20,
  },
  imgCard: {
    // alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    opacity: 1,
    height: 80,
    overflow: 'hidden',
    width: 80,
    borderRadius: 999,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imgCard2: {
    // alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    opacity: 1,
    height: 100,
    overflow: 'hidden',
    width: 100,
    borderRadius: 999,
    shadowColor: colors.white,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 14,
    color: colors.teal,
    fontFamily: fonts.semibold,
    flex: 1,
    // opacity: 0.5,
    textAlign: 'center',
    // backgroundColor:'red',
  },
  prayerText: {
    // backgroundColor:'red',
    fontSize: 13,
    color: colors.black,
    fontFamily: fonts.normal,
    flex: 1,
    textAlignVertical: 'top',
  },
  prayerTimeText: {
    // backgroundColor:'green',

    fontSize: 12,
    color: colors.black,
    flex: 1,
    fontFamily: fonts.normal,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  cardTextSm: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.white,
    opacity: 0.6,
  },
  mosqueTitle: {
    fontSize: 20,
    color: colors.white,
    fontFamily: fonts.semibold,
    marginBottom: 14,
    width: '80%',
  },
  prayerItemTitle: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fonts.semibold,
  },
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  listContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    // gap: 10,
  },
  columwrapper: {
    // gap: 10,
    // padding:10
  },
  image: {height: '100%', width: '100%', resizeMode: 'cover'},
});

export default PrayerTimesScreen; 