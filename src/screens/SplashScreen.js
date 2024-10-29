import React, {useEffect, useState} from 'react';
import {Image, View, StyleSheet, Text, Dimensions} from 'react-native';
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

const {height,width}=Dimensions.get('window')
const SplashScreen = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const checkIsLoggedIn = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     console.log('=token==', token);

  //     if (token) {
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'MainNavigator'}],
  //       });
  //     } else {
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'AuthNavigator', params: {screen: 'Login'}}],
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoggedIn(false);
  //   }
  // };
  // useEffect(() => {
  //   checkIsLoggedIn();
  // }, [isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'MainNavigator'}],
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    // <View style={styles.container}>
      <LinearGradient
      colors={['#042334', '#006665',]}
      style={styles.container} 
    >
      <WhiteStatusbar />
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={MyImages.logo_trans}
          style={{
            height:height>630? 350:300,
            // width: height>630? 290:310,
            borderRadius: 999,
            resizeMode: 'contain',
            
          }} tintColor={colors.white}
        />
        {/* <Text style={[styles.appName, {marginTop: -20}]}>Ghausia Nelson</Text> */}
      </View>
      <View style={styles.lottieContainer}>
        <LottieView
          style={styles.lottie}
          source={MyImages.loading1}
          autoPlay
          speed={0.7}
          loop={true}
        />
      </View>
      </LinearGradient>
    // </View>
    
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4EBCC',
    // backgroundColor: colors.white,
  },
  appName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    width: '100%',
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
    height: 50,
    width: 50,
  },
});
