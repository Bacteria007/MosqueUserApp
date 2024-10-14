import React, {useEffect, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkIsLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('=token==', token);

      if (token) {
        navigation.reset({
          index: 0,
          routes: [{name: 'MainNavigator'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'AuthNavigator', params: {screen: 'Login'}}],
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    checkIsLoggedIn();
  }, [isLoggedIn]);

  useEffect(() => {
    // Set a timeout of 2 seconds before navigating to the Login screen
    const timer = setTimeout(() => {}, 3000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#042334', '#006665',]}
      style={styles.container} 
    >
      <TransparentStatusbar />
      <Image
        source={MyImages.logo}
        style={{height: '30%', width: '30%', borderRadius: 999, resizeMode: 'contain'}}
      />

      <View style={styles.lottieContainer}>
        <LottieView
          style={styles.lottie}
          source={MyImages.loading1}
          autoPlay
          loop={true}
        />
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    width: '60%',
    textAlign: 'center',
  },
  lottieContainer: {
    justifyContent: 'flex-end',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    paddingBottom: 20,
  },
  lottie: {
    height: 80,
    width: 80,
  },
});
