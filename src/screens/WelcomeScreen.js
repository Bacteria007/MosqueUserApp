import {
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';
import CommonStyles from '../assets/styles/CommonStyles';
import MyImages from '../assets/images/MyImages';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import {useNavigation} from '@react-navigation/native';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import PrimaryButton from '../components/buttons/PrimaryButton';

const WelcomeScreen = () => {
  const mosqueName = 'Islamic Mosque';
  const subTitle = 'Stay Connected with Your Faith';
  const navigation = useNavigation();
  const navigateLogin = () => navigation.navigate('Login');
  const navigateSignup = () => navigation.navigate('Signup');
  return (
    <View style={styles.container}>
      {/* Hide the status bar */}
     <TransparentStatusbar/>

      <Image source={MyImages.masjid} style={styles.imageStyle} />
      <View style={styles.bottomContent}>
        <View style={styles.textsContainer}>
          <Text style={styles.title}>{mosqueName}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>

        <View style={styles.textsContainer}>
          <PrimaryButton
            title={'Login'}
            onPress={navigateLogin} loader={false}>
            <Text style={styles.btnTitle}>Login</Text>
          </PrimaryButton>
          <Pressable
            style={[styles.btnSignup, styles.btnSize]}
            onPress={navigateSignup}>
            <Text style={styles.btnTitle}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_clr,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: '50%',
    objectFit: 'cover',
  },
  title: {
    fontSize: 24,
    color: colors.white,
    fontFamily: fonts.bold,
  },
  subTitle: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fonts.normal,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 30,
    alignItems: 'center',
    width: '100%', // Ensure the bottom content takes full width
  },
  textsContainer: {
    width: '100%', // Ensure the container for buttons takes full width
    alignItems: 'center', // Center the buttons horizontally
  },
  btnLogin: {
    backgroundColor: colors.secondary,
  },
  btnSignup: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  btnSize: {
    padding: 10,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    //   opacity: 0.5,
    width: '100%',
    marginBottom: 10,
  },
  btnTitle: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.semibold,
  },
});
