import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import ApiService from '../services/api';
import { GET, prayerTimesURL } from '../services/constants';
import PushNotification from 'react-native-push-notification';
import MyImages from '../assets/images/MyImages';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import CommonStyles from '../assets/styles/CommonStyles';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';

const PrayerTimesScreen = () => {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const prayerIconSize = 30;

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      const response = await ApiService({ method: GET, url: prayerTimesURL });
      setPrayerTimes(response.data);
      scheduleAllPrayerAlarms(response.data[0]); // Schedule alarms using the fetched prayer times
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
    setLoading(false);
  };

  const scheduleAllPrayerAlarms = (times) => {
    if (!times) return;

    const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    prayerNames.forEach((prayer) => {
      const timeString = times[prayer]; // Get the time string (e.g., "05:30")
      if (timeString) {
        const alarmTime = new Date();
        const [hour, minute] = timeString.split(':');
        alarmTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

        // If the prayer time is in the past today, schedule it for tomorrow
        if (alarmTime < new Date()) {
          alarmTime.setDate(alarmTime.getDate() + 1);
        }

        PushNotification.localNotificationSchedule({
          channelId: 'prayer_reminder',
          message: `It's time for ${prayer} prayer!`,
          date: alarmTime,
          playSound: true,
          soundName: 'alarm_sound',
          allowWhileIdle: true,
          priority: 'max',
          importance: 'high',
          vibrate: true,
          vibration: 300,
          // repeatType: 'day', // Repeat daily at the same time
        });

        console.log(`Scheduled alarm for ${prayer} at ${alarmTime}`);
      }
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await ApiService({ method: GET, url: prayerTimesURL });
      setPrayerTimes(response.data);
    } catch (error) {
      console.error('Error refreshing prayer times:', error);
    }
    setRefreshing(false);
  };

  const formatTimeTo12Hour = (time) => {
    const [hour, minute] = time.split(':');
    const formattedHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  };

  const renderItem = ({ item }) => (
    <>
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.prayerItem}>
            <Text style={styles.prayerText}>Fajr</Text>
            <Image source={MyImages.fajr} style={{ height: prayerIconSize, width: prayerIconSize }} />
            <Text style={styles.prayerTimeText}>{formatTimeTo12Hour(item.fajr)}</Text>
          </View>
          <View style={styles.prayerItem}>
            <Text style={styles.prayerText}>Dhuhr</Text>
            <Image source={MyImages.zhr} style={{ height: prayerIconSize, width: prayerIconSize }} />
            <Text style={styles.prayerTimeText}>{formatTimeTo12Hour(item.dhuhr)}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.prayerItem}>
            <Text style={styles.prayerText}>Asr</Text>
            <Image source={MyImages.asr} style={{ height: prayerIconSize, width: prayerIconSize }} />
            <Text style={styles.prayerTimeText}>{formatTimeTo12Hour(item.asr)}</Text>
          </View>
          <View style={styles.prayerItem}>
            <Text style={styles.prayerText}>Maghrib</Text>
            <Image source={MyImages.mgrib} style={{ height: prayerIconSize, width: prayerIconSize }} />
            <Text style={styles.prayerTimeText}>{formatTimeTo12Hour(item.maghrib)}</Text>
          </View>
        </View>
        <View style={styles.prayerItem}>
          <Text style={styles.prayerText}>Isha</Text>
          <Image source={MyImages.isha} style={{ height: prayerIconSize, width: prayerIconSize }} />
          <Text style={styles.prayerTimeText}>{formatTimeTo12Hour(item.isha)}</Text>
        </View>
      </View>
    </>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <>
      <TransparentStatusbar />
      <View style={CommonStyles.container}>
        <FlatList
          data={prayerTimes}
          numColumns={2}
          keyExtractor={(item) => item.date}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columwrapper}
          ListHeaderComponentStyle={{ flex: 1, width: '100%' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => (
            <View style={styles.mainCard}>
              <View style={{ justifyContent: 'space-between' }}>
                <Text style={styles.mosqueTitle}>Islamiya{'\n'}Mosque</Text>
                <Text style={styles.prayerItemTitle}>Prayer Timings</Text>
                <Text style={styles.cardTextSm}>
                  {new Date(prayerTimes[0]?.date).toDateString()}
                </Text>
              </View>
              <View style={styles.imgCard}>
                <Image
                  source={MyImages.masjid}
                  style={{ height: '100%', width: '100%', resizeMode: 'cover' }}
                />
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
};


const styles = StyleSheet.create({
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
  prayerItem: {
    // flex: 1,
    width: '45%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg_clr,
    height: 140,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 4,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
    margin: 8,
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
    shadowColor: colors.secondary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  prayerText: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fonts.semibold,
    flex: 1,
    textAlignVertical: 'top',
  },
  prayerTimeText: {
    fontSize: 12,
    color: colors.white,
    flex: 1,
    fontFamily: fonts.medium,
    opacity: 0.8,
    textAlignVertical: 'bottom',
  },
  cardTextSm: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.white,
    opacity: 0.6,
  },
  mosqueTitle: {
    fontSize: 24,
    color: colors.white,
    fontFamily: fonts.semibold,
    marginBottom: 12,
  },
  prayerItemTitle: {
    fontSize: 18,
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
});

export default PrayerTimesScreen;
