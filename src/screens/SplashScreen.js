import React, {useEffect} from 'react';
import {Image, View, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WhiteStatusbar from '../components/statusbar/WhiteStatusbar';
import CommonStyles from '../assets/styles/CommonStyles';
import fonts from '../assets/fonts/MyFonts';
import colors from '../assets/colors/AppColors';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import LottieView from 'lottie-react-native';
import {appName} from '../services/constants';
import MyImages from '../assets/images/MyImages';

const SplashScreen = () => {
  const navigation = useNavigation();
  const bottomLine = 'Stay Connected with Your Faith';
  useEffect(() => {
    // Set a timeout of 2 seconds before navigating to the Login screen
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TransparentStatusbar />
      <Image
        source={MyImages.masjid}
        style={{height: '70%', width: '100%', resizeMode: 'cover'}}
      />
      <View style={styles.centerContainer}>
        <Text style={styles.appName}>{appName}</Text>
        <Text style={styles.bottomLine}>{bottomLine}</Text>
      </View>
      <View style={styles.lottieContainer}>
        <LottieView
          style={styles.lottie}
          source={MyImages.loading1}
          autoPlay
          loop={true}
        />
      </View>
    </View>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.white,
    width: '60%',
    textAlign: 'center',
  },
  bottomLine: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
  },
  lottieContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20, // Adjust to move the Lottie animation slightly up if necessary
  },
  lottie: {
    height: 80,
    width: 80,
  },
});

// <View style={CommonStyles.container}>
//   <WhiteStatusbar />
//   <Image
//     source={MyImages.masjid}
//     style={{height: '70%', width: '100%', resizeMode: 'cover'}}
//   />
//   <View style={styles.bottomContainer}>
//     <Text style={styles.appName}>{appName}</Text>
//     <Text style={styles.bottomLine}>{bottomLine}</Text>
//     <LottieView
//       style={{height: 80, width: 80}}
//       source={MyImages.loading1}
//       autoPlay
//       loop={true}
//     />
//   </View>
// </View>
