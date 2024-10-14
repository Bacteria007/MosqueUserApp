import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyImages from '../assets/images/MyImages';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import CommonStyles from '../assets/styles/CommonStyles';
import WhiteStatusbar from '../components/statusbar/WhiteStatusbar';
import {Icons} from '../assets/icons/Icons';
import {schedulePrayerNotifications} from '../utils/PrayerRemiders';

import {
  fetchPrayerTimes,
  setSelectedDate,
  filterTodayPrayers,
  filterPrayerTimes,
  calculateUpcomingAndNextPrayers,
} from '../reducers/calendarSlice';
import {appName} from '../services/constants';
import {onDisplayNotification} from '../utils/PrayerNotification';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import {Header} from 'react-native/Libraries/NewAppScreen';
import AppHeader from '../components/headers/AppHeader';

const PrayerTimesScreen = () => {
  const dispatch = useDispatch();

  const {
    prayerTimes,
    filteredPrayerTimes,
    selectedDate,
    loading,
    todayPrayers,
    upcomingPrayer,
  } = useSelector(state => state.calendar);

  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    dispatch(fetchPrayerTimes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterTodayPrayers());
    dispatch(filterPrayerTimes());
  }, [selectedDate, prayerTimes, dispatch]);

  useEffect(() => {
    dispatch(calculateUpcomingAndNextPrayers());
    if (todayPrayers) {
      // console.log('today=======', todayPrayers);
      // schedulePrayerNotifications(todayPrayers);
      // onDisplayNotification(todayPrayers[0]);
    }
  }, [todayPrayers, dispatch]);

  const calculateRemainingTime = prayerTime => {
    if (!prayerTime) return '';

    const currentTime = moment();
    let prayerTimeMoment = moment(prayerTime, 'HH:mm'); // Assuming prayer time is in "HH:mm" format

    // If the prayer time is before the current time, move it to the next day
    if (prayerTimeMoment.isBefore(currentTime)) {
      prayerTimeMoment.add(1, 'day');
    }

    const duration = moment.duration(prayerTimeMoment.diff(currentTime));

    // Extract hours and minutes from the duration
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    // Format the remaining time as "Xh Ym"
    return `${hours}h ${minutes} mins`;
  };

  // const handleDateChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setDatePickerVisibility(false);
  //   setDate(currentDate);
  //   dispatch(setSelectedDate(moment(currentDate).format('DD MMMM, YYYY')));
  // };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    dispatch(setSelectedDate(moment(newDate).format('DD MMMM, YYYY')));
  };
  const goToPreviousDate = () => {
    const previousDate = moment(selectedDate, 'DD MMMM, YYYY')
      .subtract(1, 'day')
      .toDate(); // Convert back to Date
    handleDateChange(previousDate);
  };

  const goToNextDate = () => {
    const nextDate = moment(selectedDate, 'DD MMMM, YYYY')
      .add(1, 'day')
      .toDate(); // Convert back to Date
    handleDateChange(nextDate);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const onRefresh = async () => {
    dispatch(fetchPrayerTimes()); // Dispatch action to re-fetch prayer times
  };

  const formatTimeTo12Hour = time => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const formattedHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
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
    dispatch(setSelectedDate(today));
    dispatch(filterTodayPrayers());
  };

  const isToday = selectedDate == moment().format('DD MMMM, YYYY');

  if (loading) {
    return (
      <View style={styles.overlay}>
        <LottieView
          style={{height: 80, width: 80}}
          source={MyImages.loading2}
          autoPlay
          loop={true}
        />
      </View>
    );
  }
  return (
    <>
      <TransparentStatusbar />
      <View style={CommonStyles.container}>
        <AppHeader />
        <View style={styles.mainCard2}>
          <ImageBackground
            source={MyImages.bgheader}
            style={styles.imageBackground}
            resizeMode="cover">
            <View
              style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
              <View
                style={{
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Text style={styles.prayerItemTitle}>
                  {upcomingPrayer?.name || ''}
                </Text>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 36,
                    fontFamily: fonts.semibold,
                  }}>
                  {formatTimeTo12Hour(upcomingPrayer?.time || '')}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.lighr_grey,
                    fontFamily: fonts.medium,
                  }}>
                  Begins in {calculateRemainingTime(upcomingPrayer?.time) || ''}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.dateContainer}>
          <Pressable onPress={goToPreviousDate} style={styles.chevronButton}>
            <Icons.AntDesign name="left" size={18} color={colors.teal} />
          </Pressable>
          {/* Date Picker */}
          <View style={styles.datePickerContainer}>
            <Pressable onPress={showDatePicker} style={styles.datePicker}>
              <Text style={styles.dateText}>{selectedDate}</Text>
              <Icons.AntDesign
                name="caretdown"
                size={10}
                color={colors.light_black}
                style={{marginBottom: 3}}
              />
            </Pressable>

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
          <Icons.AntDesign name="right" size={18} color={colors.teal} />
        </Pressable>
        </View>

        {isDatePickerVisible && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date(2024, 0, 1)}
            maximumDate={new Date(2024, 11, 31)}
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Prayer Times */}
        <FlatList
          data={filteredPrayerTimes ? [filteredPrayerTimes] : []}
          keyExtractor={item => item._id}
          ListHeaderComponent={() => (
            <View style={styles.listHeaderItem}>
              <Text style={[styles.headerTitle, {textAlign: 'left'}]}>
                Salah
              </Text>
              <Text style={styles.headerTitle}>Adhan</Text>
              <Text style={styles.headerTitle}>Jamaat</Text>
            </View>
          )}
          renderItem={({item}) => (
            <View style={{alignItems: 'center', marginTop: 20}}>
              {renderPrayerItem(
                item,
                'Fajr',
                item?.sehri_end,
                item?.fajar_jamat,
              )}
              {renderPrayerItem(
                item,
                'Zuhur',
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
          )}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 15,
    // paddingTop: StatusBar.currentHeight,
  },
  mainCard2: {
    // flex: 1,
    margin: 14,
    borderRadius: 15,
    height: 180,
    overflow: 'hidden',
  },
  datePicker: {
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    paddingVertical: 20,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection:'row',
    flex:1
  },
  datePickerContainer: {
    // width: '100%',
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
    fontSize: 14,
    color: colors.light_black,
    fontFamily: fonts.bold,
  },

  listHeaderItem: {
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
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg_clr,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    color: colors.teal,
    fontFamily: fonts.semibold,
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
    // marginBottom: 14,
    width: '80%',
    letterSpacing: 3,
  },
  prayerItemTitle: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.semibold,
  },
  prayerText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.normal,
    flex: 1,
    textAlignVertical: 'top',
  },
  prayerTimeText: {
    fontSize: 12,
    color: colors.black,
    flex: 1,
    fontFamily: fonts.normal,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  image: {height: '100%', width: '100%', resizeMode: 'cover'},
});

export default PrayerTimesScreen;
