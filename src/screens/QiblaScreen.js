import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import Geolocation from '@react-native-community/geolocation';
import MyImages from '../assets/images/MyImages';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import CommonStyles from '../assets/styles/CommonStyles';
import ScreenWrapper from '../components/wrapers/ScreenWrapper';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import {Icons} from '../assets/icons/Icons';
import MyHeader from '../components/headers/MyHeader';
import WhiteStatusbar from '../components/statusbar/WhiteStatusbar';

const QiblaScreen = () => {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [rotation, setRotation] = useState(new Animated.Value(0));

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position); // Log the position
        const {latitude, longitude} = position.coords;
        const calculatedQiblaDirection = calculateQiblaDirection(
          latitude,
          longitude,
        );
        console.log(`Calculated Qibla Direction: ${calculatedQiblaDirection}`); // Log calculated direction
        setQiblaDirection(calculatedQiblaDirection);
      },
      error => {
        console.error('Error fetching location: ', error);
      },
      // { enableHighAccuracy: true, timeout: 30000, maximumAge: 1000 }
    );
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
      }
    };
    requestPermissions();

    const degree_update_rate = 0.5;

    CompassHeading.start(degree_update_rate, ({heading: newHeading}) => {
      setHeading(newHeading);
    });

    getCurrentLocation();

    return () => {
      CompassHeading.stop();
    };
  }, [getCurrentLocation]);

  useEffect(() => {
    const rotateValue = (qiblaDirection - heading + 360) % 360;
    Animated.timing(rotation, {
      toValue: rotateValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [heading, qiblaDirection, rotation]);

  const calculateQiblaDirection = (latitude, longitude) => {
    const KAABA_LATITUDE = 21.4225;
    const KAABA_LONGITUDE = 39.8262;

    const lat1 = (latitude * Math.PI) / 180.0;
    const lat2 = (KAABA_LATITUDE * Math.PI) / 180.0;
    const longDiff = ((KAABA_LONGITUDE - longitude) * Math.PI) / 180.0;

    const y = Math.sin(longDiff) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(longDiff);

    const bearing = (Math.atan2(y, x) * 180.0) / Math.PI;
    return (bearing + 360) % 360;
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScreenWrapper refreshAct={() => getCurrentLocation()}>
     <WhiteStatusbar/>
      <View style={CommonStyles.container}>
        <MainScreensHeader
          title={'Qibla Direction'}
          subTitle={'Stay Connected with Your Faith'}
        />
        {/* Compass Visualization with Card Background */}
        <View style={{flex:1,justifyContent:'space-around',alignItems:'center',}}>
        <View style={styles.compassContainer}>
          <Image
            source={MyImages.degree_circle}
            style={styles.compassBackground}
          />
          <Animated.Image
            source={MyImages.needle_msjid}
            style={[styles.needle, {transform: [{rotate: rotateInterpolate}]}]}
          />
        </View>

        {/* Text and Qibla Information in a Card */}
        <View style={styles.infoCard}>
          {/* <Text style={styles.infoText}>Heading: {heading.toFixed(2)}°</Text> */}
          <Icons.MaterialCommunityIcons
            name="compass"
            size={20}
            color={colors.teal}
          />
          <Text style={styles.infoText}>
            Qibla Direction: {qiblaDirection.toFixed(2)}°
          </Text>
          {/* <Text style={styles.infoText}>
            Rotate: {(qiblaDirection - heading).toFixed(2)}° to face Qibla
          </Text> */}
        </View>
      </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg_clr,
  },
  compassCard: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    alignSelf: 'center',
    backgroundColor: colors.white,
    // iOS shadow
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Android elevation
    elevation: 8,
    borderRadius:999
  },
  compassContainer: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    alignSelf: 'center',
    backgroundColor: colors.white,
    // iOS shadow
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Android elevation
    elevation: 8,
    borderRadius:999
  },
  compassBackground: {
    width: 230,
    height: 230,
    borderRadius:999
  },
  needle: {
    width: 120,
    height: 120,
    position: 'absolute',
    resizeMode: 'contain',
  },
  infoCard: {
    bottom: 20,
    width: '100%',
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',

  },
  infoText: {

    color: colors.black,
    fontSize: 12,
    fontFamily: fonts.medium,
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default QiblaScreen;
