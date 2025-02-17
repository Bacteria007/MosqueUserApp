import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyImages from '../assets/images/MyImages';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import CommonStyles from '../assets/styles/CommonStyles';
import {Icons} from '../assets/icons/Icons';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AppHeader from '../components/headers/AppHeader';
import momenthijri from 'moment-hijri';
import {useFocusEffect} from '@react-navigation/native';
import {checkAndRequestLocationPermission} from '../utils/LocationPermission';
import {getCalendar} from '../reducers/calendarSlice';
import {schedulePrayerAlarms} from '../utils/PrayerAlarm';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const {height} = Dimensions.get('window');
const headerCardHeight = 130;
// const headerCardHeight = height < 630 ? 160 : 130;

const PrayerTimesScreen = () => {
  const [upcomingPrayer, setUpcomingPrayer] = useState({});
  const [todayPrayers, setTodayPrayers] = useState({});
  const [nextPrayer, setNextPrayer] = useState({});
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [islamicDate, setIslamicDate] = useState('');
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(
    moment().format('DD MMMM, YYYY'),
  );
  const [jumaTimings, setJumaTimings] = useState({khutbah: null, salah: null});
  const calendarData = useSelector(state => state.calendar.calendar);
  const isReminderEnabled = useSelector(
    state => state.notification.isReminderEnabled,
  );
  useEffect(() => {
    dispatch(getCalendar());
  }, [dispatch]);

  useEffect(() => {
    // if (moment().format('dddd') === 'Friday') {
    const zuhrJamatTime = todayPrayers?.zuhar_jamat;

    if (zuhrJamatTime) {
      const khutbahTime = moment(zuhrJamatTime, 'HH:mm')
        .subtract(30, 'minutes')
        .format('HH:mm');
      setJumaTimings({khutbah: khutbahTime, salah: zuhrJamatTime});
      // }
    }
  }, [todayPrayers]);

  useEffect(() => {
    if (isReminderEnabled && todayPrayers) {
      const prayersArray = [
        {
          name: 'Fajr',
          time: todayPrayers?.sehri_end,
          jamatTime: todayPrayers.fajar_jamat,
        },
        {
          name: 'Zuhr',
          time: todayPrayers?.zuhar_begin,
          jamatTime: todayPrayers.zuhar_jamat,
        },
        {
          name: 'Asr',
          time: todayPrayers?.asar_begin,
          jamatTime: todayPrayers.asar_jamat,
        },
        {
          name: 'Maghrib',
          time: todayPrayers?.magrib_jamat,
          jamatTime: todayPrayers.magrib_jamat,
        },
        {
          name: 'Isha',
          time: todayPrayers?.isha_begin,
          jamatTime: todayPrayers.isha_jamat,
        },
      ].filter(prayer => prayer.time);
      console.log("prayersArray home",prayersArray);

      schedulePrayerAlarms(prayersArray);
    }
  }, [todayPrayers, isReminderEnabled]);

  // ============ Location start
  useFocusEffect(
    React.useCallback(() => {
      checkAndRequestLocationPermission();
    }, []),
  );
  // ============ Location End
  useEffect(() => {
    momenthijri.locale('en');
    const hijriDate = momenthijri().format('iD iMMMM iYYYY');
    setIslamicDate(hijriDate);
  }, []);

  useEffect(() => {
    if (calendarData && calendarData.length > 0) {
      loadPrayersForDate(selectedDate);
    }
  }, [calendarData, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      if (selectedDate === moment().format('DD MMMM, YYYY')) {
        calculateUpcomingAndNextPrayers();
      }
    }, [selectedDate, todayPrayers]),
  );

  const loadPrayersForDate = dateString => {
    const formattedDate = moment(dateString, 'DD MMMM').format('DD/MM');
    const prayerTimes =
      calendarData?.find(item => item.date === formattedDate) || {};
    setTodayPrayers(prayerTimes);
    const hijriDate = momenthijri(moment(dateString, 'DD MMMM, YYYY')).format(
      'iD iMMMM iYYYY',
    );
    setIslamicDate(hijriDate);
  };

  const calculateUpcomingAndNextPrayers = () => {
    if (!todayPrayers || Object.keys(todayPrayers).length === 0) {
      setUpcomingPrayer(null);
      setNextPrayer(null);
      return;
    }

    const prayerSchedule = [
      {name: 'Fajr', time: todayPrayers.fajar_jamat},
      {name: 'Zuhr', time: todayPrayers.zuhar_jamat},
      {name: 'Asr', time: todayPrayers.asar_jamat},
      {name: 'Maghrib', time: todayPrayers.magrib_jamat},
      {name: 'Isha', time: todayPrayers.isha_jamat},
    ];

    // const currentTime = moment('21:00', 'HH:mm');
    const currentTime = moment();
    let foundUpcomingPrayer = false;

    // Find the first upcoming prayer for today
    for (const prayer of prayerSchedule) {
      const prayerTime = moment(prayer.time, 'HH:mm');
      if (prayerTime.isAfter(currentTime)) {
        setUpcomingPrayer(prayer);
        foundUpcomingPrayer = true;
        break;
      }
    }

    if (!foundUpcomingPrayer) {
      setUpcomingPrayer(null);

      const nextDate = moment(selectedDate, 'DD MMMM, YYYY').add(1, 'day');
      const nextDayPrayers = calendarData?.find(
        item => item.date === nextDate.format('DD/MM'),
      );

      if (nextDayPrayers) {
        const nextDayPrayerSchedule = [
          {name: 'Fajr', time: nextDayPrayers.sehri_end},
          {name: 'Zuhr', time: nextDayPrayers.zuhar_begin},
          {name: 'Asr', time: nextDayPrayers.asar_begin},
          {name: 'Maghrib', time: nextDayPrayers.magrib_jamat},
          {name: 'Isha', time: nextDayPrayers.isha_begin},
        ];

        setNextPrayer(nextDayPrayerSchedule[0]);
      }
    }
  };

  const handleDateChange = newDate => {
    const newDateString = moment(newDate).format('DD MMMM, YYYY');
    setSelectedDate(newDateString);
    loadPrayersForDate(newDateString);
  };
  const filterTodayPrayers = () => {
    const todayDate = moment().format('DD MMMM, YYYY');
    setSelectedDate(todayDate);
    loadPrayersForDate(todayDate);
  };

  const goToPreviousDate = () => {
    const previousDate = moment(selectedDate, 'DD MMMM, YYYY')
      .subtract(1, 'day')
      .toDate();
    handleDateChange(previousDate);
  };

  const goToNextDate = () => {
    const nextDate = moment(selectedDate, 'DD MMMM, YYYY')
      .add(1, 'day')
      .toDate();
    handleDateChange(nextDate);
  };

  const calculateRemainingTime = prayerTime => {
    if (!prayerTime) return '';
    const currentTime = moment();
    const prayerMoment = moment(prayerTime, 'HH:mm');

    if (prayerMoment.isBefore(currentTime)) {
      prayerMoment.add(1, 'day');
    }

    const duration = moment.duration(prayerMoment.diff(currentTime));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    return `${hours}h ${minutes} mins`;
  };

  const formatTimeTo12Hour = time => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const formattedHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  // calendar end

  const onRefresh = async () => {
    filterTodayPrayers();
  };

  const renderPrayerItem = (item, prayerName, azanTime, jamatTime) => {
    const today = moment().format('DD MMMM, YYYY');
    const isNextPrayer =
      selectedDate == today && upcomingPrayer?.name == prayerName;

    return (
      <View
        style={[
          styles.prayerItem,
          isNextPrayer && {backgroundColor: colors.primary},
        ]}>
        <Text
          style={[
            styles.prayerText,
            {fontFamily: fonts.semibold},
            isNextPrayer && {color: colors.white},
          ]}>
          {prayerName}
        </Text>
        <Text
          style={[
            styles.prayerTimeText,
            isNextPrayer && {color: colors.white},
          ]}>
          {formatTimeTo12Hour(azanTime)}
        </Text>
        <Text
          style={[
            styles.prayerTimeText,
            isNextPrayer && {color: colors.white},
          ]}>
          {formatTimeTo12Hour(jamatTime)}
        </Text>
      </View>
    );
  };

  const refreshToToday = () => {
    const today = moment().format('DD MMMM, YYYY');
    setSelectedDate(today);
    filterTodayPrayers();
  };
  const handleCalendarDateChange = (event, selectedDate) => {
    // If no date is selected, maintain the current date
    const currentDate = selectedDate || date;
    setDatePickerVisibility(false); // Close the date picker

    // Format the date and update states
    const newDateString = moment(currentDate).format('DD MMMM,YYYY');
    setDate(currentDate);
    setSelectedDate(newDateString);
    loadPrayersForDate(newDateString); // Load prayer times for the selected date

    // Update Hijri date
    const hijriDate = momenthijri(currentDate).format('iD iMMMM iYYYY');
    setIslamicDate(hijriDate);
  };

  const isToday = selectedDate == moment().format('DD MMMM, YYYY');

  return (
    <View style={CommonStyles.container}>
      <TransparentStatusbar />
      <AppHeader />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }>
        <View style={styles.mainCard2}>
          <ImageBackground
            source={MyImages.bgheader}
            style={styles.imageBackground}
            resizeMode="cover">
            {/* Light black overlay */}
            <View style={styles.overlayContainer}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{alignItems: 'center', width: '100%'}}>
                  <Text style={styles.prayerItemTitle}>
                    {upcomingPrayer?.name || nextPrayer?.name || ''}
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 30,
                      fontFamily: fonts.semibold,
                    }}>
                    {formatTimeTo12Hour(
                      upcomingPrayer?.time || nextPrayer?.time || '',
                    )}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.white,
                      fontFamily: fonts.medium,
                    }}>
                    Jama'ah in{' '}
                    {calculateRemainingTime(upcomingPrayer?.time) ||
                      nextPrayer?.time}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.dateContainer}>
          <Pressable onPress={goToPreviousDate} style={styles.chevronButton}>
            <Icons.Octicons name="chevron-left" size={22} color={colors.teal} />
          </Pressable>
          {/* Date Picker */}
          <View style={styles.datePickerContainer}>
            <View>
              <Pressable onPress={showDatePicker} style={styles.datePicker}>
                <Text style={styles.dateText}>{selectedDate}</Text>
                <Icons.AntDesign
                  name="caretdown"
                  size={10}
                  color={colors.black}
                  style={{marginBottom: 3}}
                />
              </Pressable>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: fonts.semibold,
                  color: colors.black,
                  textAlign: 'center',
                  marginRight: 10,
                }}>
                {islamicDate}
              </Text>
            </View>
            {!isToday && (
              <Pressable onPress={refreshToToday}>
                <Icons.MaterialCommunityIcons
                  name="refresh"
                  size={22}
                  color={colors.primary}
                />
              </Pressable>
            )}
          </View>

          <Pressable onPress={goToNextDate} style={styles.chevronButton}>
            <Icons.Octicons
              name="chevron-right"
              size={22}
              color={colors.teal}
            />
          </Pressable>
        </View>

        {isDatePickerVisible && (
          <DateTimePicker
            value={date}
            mode="date"
            // minimumDate={new Date(2024, 0, 1)}
            // maximumDate={new Date(2024, 11, 31)}
            display="default"
            onChange={handleCalendarDateChange}
          />
        )}

        {/* Prayer Times */}
        <FlatList
          data={todayPrayers ? [todayPrayers] : []}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={styles.listHeaderItem}>
              <Text style={[styles.headerTitle, {textAlign: 'left'}]}>
                Salah
              </Text>
              <Text style={styles.headerTitle}>Begin</Text>
              <Text style={styles.headerTitle}>Jama'ah</Text>
            </View>
          )}
          renderItem={({item}) => {
            // console.log('pratyuifgfgh', item);

            return (
              <View style={{alignItems: 'center', marginTop: 20}}>
                {renderPrayerItem(
                  item,
                  'Fajr',
                  item?.sehri_end,
                  item?.fajar_jamat,
                )}
                {renderPrayerItem(
                  item,
                  'Zuhr',
                  item?.zuhar_begin,
                  item?.zuhar_jamat,
                )}
                {renderPrayerItem(
                  item,
                  'Asr',
                  item?.asar_begin,
                  item?.asar_jamat,
                )}
                {renderPrayerItem(
                  item,
                  'Maghrib',
                  item?.magrib_jamat,
                  item?.magrib_jamat,
                )}
                {renderPrayerItem(
                  item,
                  'Isha',
                  item?.isha_begin,
                  item?.isha_jamat,
                )}
              </View>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        />
        {jumaTimings.khutbah && (
          <>
            <View style={styles.jumaheading}>
              <View
                style={{
                  borderColor: colors.lighr_grey,
                  borderBottomWidth: 1,
                  flex: 1,
                  marginStart: 25,
                }}></View>

              <Text style={styles.jumaheadingtxt}>Jumu'ah Time</Text>
              <View
                style={{
                  borderColor: colors.lighr_grey,
                  flex: 1,
                  marginEnd: 25,
                  borderBottomWidth: 1,
                }}></View>
            </View>
            {/* <View style={{borderColor:colors.lighr_grey,borderBottomWidth:1,marginHorizontal:40,marginBottom:10}}></View> */}
            <View style={styles.jumaitme}>
              <View style={styles.jumaheader}>
                <Text style={styles.jumatitle}>Khutbah</Text>
                <Text style={styles.jumatitle}>Jama'ah</Text>
              </View>
              <View style={styles.jumatimecontainer}>
                <Text style={styles.jumatimetext}>
                  {formatTimeTo12Hour(jumaTimings.khutbah)}
                </Text>
                <Text style={styles.jumatimetext}>
                  {formatTimeTo12Hour(jumaTimings.salah)}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 10,
    // paddingTop: StatusBar.currentHeight,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard2: {
    // flex: 1,
    margin: 14,
    borderRadius: 10,
    height: headerCardHeight,
    overflow: 'hidden',
  },
  datePicker: {
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    marginTop: 5,
    marginBottom: 8,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  datePickerContainer: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white, // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Ensure it stays on top
  },
  dateText: {
    fontSize: 15,
    color: colors.black,
    fontFamily: fonts.bold,
  },

  listHeaderItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.teal,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 5,
    elevation: 2,
    marginTop: 8,
  },
  prayerItem: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg_clr,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 14,
  },
  jumaitme: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg_clr,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  jumaheader: {
    borderBlockColor: colors.lighr_grey,
    borderBottomWidth: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  jumaheading: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  jumaheadingtxt: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  jumatitle: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  jumatimecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 5,
  },
  headerTitle: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.bold,
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.medium,
  },
  mosqueTitle: {
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.medium,
    width: '80%',
    letterSpacing: 3,
  },
  prayerItemTitle: {
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.semibold,
  },
  prayerText: {
    fontSize: 15,
    color: colors.black,
    fontFamily: fonts.normal,
    flex: 1,
    textAlignVertical: 'top',
  },
  jumatimetext: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.bold,
  },
  prayerTimeText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
    fontFamily: fonts.bold,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  image: {height: '100%', width: '100%', resizeMode: 'cover'},
});

export default PrayerTimesScreen;
