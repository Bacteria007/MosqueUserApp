// src/screens/SignupScreen.js
import React, {useState} from 'react';
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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {signup} from '../reducers/authSlice';
import axios from 'axios';
import CommonStyles from '../assets/styles/CommonStyles';
import MyTextInput from '../components/inputs/MyTextInput';
import YellowBtn from '../components/buttons/YellowBtn';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import MyImages from '../assets/images/MyImages';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {loading, signupError} = useSelector(state => state.auth);

  const handleSignup = () => {
    if (email == '') {
      setEmailError('Please enter email');
      return;
    }
    if (password == '') {
      setPasswordError('Please enter password');
      return;
    }

    console.log({email, password});
    const signupResult = dispatch(signup({email, password}));
    console.log(signupResult.type);

    if (signupResult.type == '/auth/register/rejected') {
      Alert.alert('Signup failed');
    } else {
      // navigation.navigate('LoginScreen');
      console.log('success');
    }
  };

  return (
    <View style={styles.container}>
      <TransparentStatusbar />
      <Image source={MyImages.masjid} style={CommonStyles.authImage} />
      <ScrollView style={{flexGrow: 1}}>

      <View style={CommonStyles.authBottomConatiner}>
        <Text style={CommonStyles.authTitle}>Sign Up</Text>
        <View>
          <MyTextInput
            placeholder="Email"
            state={email}
            setState={setEmail}
            // style={styles.input}
            keyboard="email-address"
            autoCapitalize="none"
          />
          {emailError && <Text style={CommonStyles.errorText}>{emailError}</Text>}
          <MyTextInput
            placeholder="Password"
            state={password}
            setState={setPassword}
            // style={styles.input}
            secureTextEntry={true}
            style={{
              marginBottom: 15,
            }}
            // style={{}}
          />
        </View>
        {passwordError && <Text style={CommonStyles.errorText}>{passwordError}</Text>}

        {signupError && <Text style={styles.errorText}>{signupError}</Text>}
        <View>
          {/* {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : ( */}
          <YellowBtn
            title="Sign up"
            onPress={() => handleSignup()}
            loader={loading}
          />

          {/* )} */}
          <Text
            style={styles.login_link}
            onPress={() => navigation.navigate('Login')}>
            Already have an account? <Text style={styles.bold}>Login</Text>
          </Text>
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
  bottomContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    // alignItems:'center',
    width: '100%',
  },
  input: {borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5},
  login_link: {
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
});

export default SignupScreen;
