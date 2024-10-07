import React, {useState} from 'react';
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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../reducers/authSlice';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import MyImages from '../assets/images/MyImages';
import CommonStyles from '../assets/styles/CommonStyles';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import MyTextInput from '../components/inputs/MyTextInput';
import MyButton from '../components/buttons/MyButton';
import YellowBtn from '../components/buttons/YellowBtn';
import {Icons} from '../assets/icons/Icons';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const {loading, loginError} = useSelector(state => state.auth);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    }
  };

  return (
    <View style={styles.container}>
      <TransparentStatusbar />
      <Image source={MyImages.masjid} style={CommonStyles.authImage} />
      <ScrollView style={{flexGrow: 1}}>
        <View style={CommonStyles.authBottomConatiner}>
          <Text style={CommonStyles.authTitle}>Login</Text>
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
          <YellowBtn
            title={'Login'}
            onPress={() => handleLogin()}
            loader={loading}
          />
          <Text
            style={styles.signup_link}
            onPress={() => navigation.navigate('Signup')}>
            Don't have an account? <Text style={styles.bold}>Sign Up</Text>
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              marginTop: 10,
            }}>
            <Pressable
              style={[styles.googleBtn, {backgroundColor: colors.white}]}>
              <Image source={MyImages.google} style={{height: 20, width: 20}} />
            </Pressable>
            <Pressable
              style={[styles.googleBtn, {backgroundColor: colors.blue}]}>
              <Icons.FontAwesome
                name={'facebook'}
                size={20}
                color={colors.white}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.bg_clr,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  btnLogin: {
    marginTop: 15,
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  forgot_link: {
    color: colors.white,
    marginBottom: 5,
    textAlign: 'right',
    fontSize: 12,
    marginRight: 8,
    fontFamily: fonts.normal,
    textDecorationLine: 'underline',
  },
  signup_link: {
    color: colors.white,
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.normal,
  },
  bold: {
    fontFamily: fonts.bold,
    textDecorationLine: 'underline',
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
