import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../reducers/authSlice';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import MyImages from '../assets/images/MyImages';
import CommonStyles from '../assets/styles/CommonStyles';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import MyTextInput from '../components/inputs/MyTextInput';
import PrimaryButton from '../components/buttons/PrimaryButton';
import {Icons} from '../assets/icons/Icons';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const {loading, loginError} = useSelector(state => state.auth);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (email == '') {
      setEmailError('Please enter email');
      return;
    }
    if (password == '') {
      setPasswordError('Please enter password');
      return;
    }
    const loginResult = await dispatch(login({email, password}));
    console.log('login=====', loginResult.type);

    if (loginResult.type == 'auth/login/rejected') {
      Alert.alert('Login failed');
    } else {
      // Navigate to next screen
      console.log('Login success');
      // navigation.navigate('Prayer Times');
    }
  };

  return (
    <View
      style={styles.container}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TransparentStatusbar />
      <View style={CommonStyles.authHeader}>
        <Text style={CommonStyles.authTitle}>Login</Text>
        <Text style={CommonStyles.authSubtitle}>Welcome Back!</Text>
      </View>
      <View style={CommonStyles.authBottomConatiner}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <MyTextInput
            placeholder="Email"
            state={email}
            setState={setEmail}
            keyboard="email-address"
            autoCapitalize="none"
          />
          {emailError && (
            <Text style={CommonStyles.errorText}>{emailError}</Text>
          )}
          <MyTextInput
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
          <View
            style={[
              CommonStyles.authFooter,
              // isKeyboardVisible ?{marginTop:100}:{marginBottom:40}
            ]}>
            <Text
              style={styles.signup_link}
              onPress={() => navigation.navigate('Signup')}>
              Don't have an account? <Text style={styles.bold}>Sign Up</Text>
            </Text>

            <View style={styles.socialButtons}>
              <Pressable
                style={[
                  styles.googleBtn,
                  {backgroundColor: colors.primaryLight},
                ]}>
                <Image
                  source={MyImages.google}
                  style={{height: 20, width: 20}}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.googleBtn,
                  {backgroundColor: colors.primaryLight},
                ]}>
                <Icons.FontAwesome
                  name={'facebook'}
                  size={20}
                  color={colors.blue}
                />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_clr,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: 'center',
    // marginTop:60,
    // width: '100%',
  },
  footer: {
    padding: 20,
    backgroundColor: colors.bg_clr,
    alignItems: 'center',
    justifyContent: 'flex-end', // Ensures content sticks to the bottom
  },
  forgot_link: {
    color: colors.primary,
    marginBottom: 5,
    textAlign: 'right',
    fontSize: 12,
    marginRight: 8,
    fontFamily: fonts.normal,
    textDecorationLine: 'underline',
  },
  signup_link: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.normal,
  },
  bold: {
    fontFamily: fonts.bold,
    textDecorationLine: 'underline',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  googleBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
  },
});

export default LoginScreen;
