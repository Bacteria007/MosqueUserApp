import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {signup} from '../reducers/authSlice';
import axios from 'axios';
import CommonStyles from '../assets/styles/CommonStyles';
import AuthTextinput from '../components/inputs/AuthTextinput';
import YellowBtn from '../components/buttons/YellowBtn';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import MyImages from '../assets/images/MyImages';
import WhiteStatusbar from '../components/statusbar/WhiteStatusbar';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Toast from 'react-native-toast-message';
import AuthHeader from '../components/headers/AuthHeader';

const SignupScreen = ({navigation}) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,#^])[A-Za-z\d@$!%*?&.,#^]{8,}$/;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {loading, signupError} = useSelector(state => state.auth);

  const handleSignup = () => {
    if (name == '') {
      setNameError('Please enter your name');
      return;
    }
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

    console.log({email, password});
    const signupResult = dispatch(signup({email, password, name}));
    console.log(signupResult.type);

    if (signupResult.type == '/auth/register/rejected') {
    } else {
      setEmail('')
      setPassword('')
      navigation.reset({
        index: 0,
        routes: [{name: 'MainNavigator'}],
      });
      console.log('Login success');
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader/>
      <View style={CommonStyles.authBottomConatiner}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AuthTextinput
            placeholder="Name"
            state={name}
            setState={setName}
            autoCapitalize="none"
          />
          {nameError && <Text style={CommonStyles.errorText}>{nameError}</Text>}
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
            secureTextEntry={true}
            style={{marginBottom: 15}}
          />
          {passwordError && (
            <Text style={CommonStyles.errorText}>{passwordError}</Text>
          )}
          {signupError && <Text style={styles.errorText}>{signupError}</Text>}
          <PrimaryButton
            title="Sign up"
            onPress={handleSignup}
            loader={loading}
          />
          <View style={CommonStyles.authFooter}>
            <Text
              style={styles.login_link}
              onPress={() => navigation.navigate('Login')}>
              Already have an account? <Text style={styles.bold}>Login</Text>
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
    justifyContent: 'center',
    backgroundColor: colors.img4,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  footer: {
    paddingBottom: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.bg_clr,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  login_link: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.normal,
  },
  bold: {
    color: colors.img1,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});

export default SignupScreen;
