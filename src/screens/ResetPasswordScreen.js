import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import api from '../services/api';
import CommonStyles from '../assets/styles/CommonStyles';
import AuthTextinput from '../components/inputs/AuthTextinput';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AuthHeader from '../components/headers/AuthHeader';

const ResetPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleResetPassword = async () => {
    if (email == '') {
      setEmailError('Please enter email');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {email});
      navigation.navigate('Login');
    } catch (error) {}
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <AuthHeader title={'Reset Password'} style={{height: '65%'}} />
      <View style={CommonStyles.authBottomConatiner}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AuthTextinput
            placeholder="Enter your email"
            state={email}
            setState={setEmail}
            keyboard="email-address"
            autoCapitalize="none"
            style={{marginBottom: 10}}
          />
          {emailError && (
            <Text style={CommonStyles.errorText}>{emailError}</Text>
          )}

          <PrimaryButton
            title="Reset"
            onPress={() => handleResetPassword()}
            loader={loading}
          />
          <View style={CommonStyles.authFooter}>
            <Text
              style={styles.login_link}
              onPress={() => navigation.navigate('Login')}>
              Back to <Text style={styles.bold}>Login</Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.img4,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  footer: {
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  login_link: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.normal,
    marginBottom: 30,
  },
  bold: {
    fontSize: 14,
    color: colors.img1,
    fontFamily: fonts.bold,
  },
});

export default ResetPasswordScreen;
