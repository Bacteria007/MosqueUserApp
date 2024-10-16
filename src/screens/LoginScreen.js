import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../reducers/authSlice';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import MyImages from '../assets/images/MyImages';
import CommonStyles from '../assets/styles/CommonStyles';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AuthTextinput from '../components/inputs/AuthTextinput';
import PrimaryButton from '../components/buttons/PrimaryButton';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AuthHeader from '../components/headers/AuthHeader';

const LoginScreen = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,#^])[A-Za-z\d@$!%*?&.,#^]{8,}$/;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const {loading, loginError} = useSelector(state => state.auth);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (email == '') {
      setEmailError('Please enter email');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    // if (!passwordRegex.test(password)) {
    //   setPasswordError(
    //     'Password must contain at least 8 characters, one uppercase letter, one number, and one special character [@, $, !, %, *, ?, &, ., #, ^].',
    //   );
    //   return;
    // }
    if (password == '') {
      setPasswordError('Please enter password');
      return;
    }

    const loginResult = await dispatch(login({email, password}));
    console.log('login=====', loginResult.type);

    if (loginResult.type == 'auth/login/rejected') {
      console.log('Login failed'); // Log the failure
    } else {
      setEmail('');
      setPassword('');
      navigation.reset({
        index: 0,
        routes: [{name: 'MainNavigator'}],
      });
      console.log('Login success');
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader title={'Welcome Back!'} />
      <View style={CommonStyles.authBottomConatiner}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AuthTextinput
            placeholder="Email"
            state={email}
            setState={setEmail}
            keyboard="email-address"
            autoCapitalize="none"
          />
          {emailError && (
            <Text style={CommonStyles.errorText}>{emailError}</Text>
          )}
          <AuthTextinput
            placeholder="Password"
            state={password}
            setState={setPassword}
            style={{marginBottom: 15}}
            secureTextEntry={true}
          />
          {passwordError && (
            <Text style={CommonStyles.errorText}>{passwordError}</Text>
          )}
          <Text
            style={styles.forgot_link}
            onPress={() => navigation.navigate('ResetPassword')}>
            Forgot Password?
          </Text>
          {loginError && (
            <Text style={CommonStyles.errorText}>{loginError}</Text>
          )}
          <PrimaryButton
            title={'Login'}
            onPress={() => handleLogin()}
            loader={loading}
          />
          {/* Sticky footer */}
          <View style={[CommonStyles.authFooter]}>
            <Text
              style={styles.signup_link}
              onPress={() => navigation.navigate('Signup')}>
              Don't have an account? <Text style={styles.bold}>Sign Up</Text>
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
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.bg_clr,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  forgot_link: {
    color: colors.img1,
    marginBottom: 5,
    textAlign: 'right',
    fontSize: 14,
    marginRight: 8,
    fontFamily: fonts.medium,
  },
  signup_link: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.normal,
    marginBottom:30
  },
  bold: {
    fontSize: 14,
    color: colors.img1,
    fontFamily: fonts.medium,
  },
});

export default LoginScreen;
