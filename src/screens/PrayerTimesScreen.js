import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  Image,
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

// Redux actions
import {
  fetchPrayerTimes,
  setSelectedDate,
  filterTodayPrayers,
  filterPrayerTimes,
  calculateUpcomingAndNextPrayers,
} from '../reducers/calendarSlice';
import {appName} from '../services/constants';

const PrayerTimesScreen = () => {
  const dispatch = useDispatch();

  // Select states from the calendar slice in Redux
  const {
    prayerTimes,
    filteredPrayerTimes,
    selectedDate,
    loading,
    todayPrayers,
    upcomingPrayer,
  } = useSelector(state => state.calendar);

  const [date, setDate] = useState(new Date()); // For DateTimePicker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Dispatch action to fetch prayer times on component mount
  useEffect(() => {
    dispatch(fetchPrayerTimes());
  }, [dispatch]);

  // Filter prayers when the selected date or prayer times change
  useEffect(() => {
    dispatch(filterTodayPrayers());
    dispatch(filterPrayerTimes());
  }, [selectedDate, prayerTimes, dispatch]);

   
  useEffect(() => {
    dispatch(calculateUpcomingAndNextPrayers());
    if (todayPrayers) {
      schedulePrayerNotifications(todayPrayers);
    }
  }, [todayPrayers, dispatch]);

  // Handle Date Change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(false); // Hide the picker
    setDate(currentDate);
    dispatch(setSelectedDate(moment(currentDate).format('DD MMMM, YYYY'))); // Update selected date in Redux
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

  // Function to render each prayer item
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

  // Function to reset the selected date to today
  const refreshToToday = () => {
    const today = moment().format('DD MMMM, YYYY');
    dispatch(setSelectedDate(today));
    dispatch(filterTodayPrayers());
  };

  const isToday = selectedDate === moment().format('DD MMMM, YYYY');

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
        <View style={styles.datePickerContainer}>
          <Pressable onPress={showDatePicker} style={styles.datePicker}>
            <Text style={styles.dateText}>{selectedDate}</Text>
            <Icons.AntDesign
              name="caretdown"
              size={20}
              color={colors.light_black}
              style={{marginBottom: 8}}
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
  datePicker: {
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white, // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Ensure it stays on top
  },
  dateText: {
    fontSize: 18,
    color: colors.light_black,
    fontFamily: fonts.bold,
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
  },
  imgCard2: {
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
