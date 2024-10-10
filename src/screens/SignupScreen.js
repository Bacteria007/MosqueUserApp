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

const SignupScreen = ({navigation}) => {
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
    if (email == '') {
      setEmailError('Please enter email');
      return;
    }
    if (password == '') {
      setPasswordError('Please enter password');
      return;
    }

    console.log({email, password});
    const signupResult = dispatch(signup({email, password, name}));
    console.log(signupResult.type);

    if (signupResult.type == '/auth/register/rejected') {
      Alert.alert('Signup failed');
    } else {
      console.log('Signup success');
    }
  };

  return (
    <View style={styles.container}>
      <TransparentStatusbar />
      {/* <View style={CommonStyles.authHeader}>
        <Text style={CommonStyles.authTitle}>Sign Up</Text>
        <Text style={CommonStyles.authSubtitle}>Create Account!</Text>
      </View> */}
       <Image
        source={MyImages.masjid}
        style={{height: '60%', width: '100%', resizeMode: 'cover'}}
      />
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
          {/* Footer section for Login link */}
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
    backgroundColor: colors.bg_clr,
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
    color: colors.primary,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.normal,
  },
  bold: {
    fontFamily: fonts.bold,
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
