// src/screens/ResetPasswordScreen.js
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import api from '../services/api';
import CommonStyles from '../assets/styles/CommonStyles';
import MyTextInput from '../components/inputs/MyTextInput';
import YellowBtn from '../components/buttons/YellowBtn';
import MyImages from '../assets/images/MyImages';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';

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
      Alert.alert(
        'Success',
        response.data.message || 'Check your email for reset instructions.',
      );
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'An error occurred.',
      );
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TransparentStatusbar />
      <Image source={MyImages.masjid} style={CommonStyles.authImage} />
      <ScrollView style={{flexGrow: 1}}>
        <View style={styles.bottomContent}>
          <Text style={CommonStyles.authTitle}>Reset Password</Text>
          <View>
            <MyTextInput
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

            <YellowBtn
              title="Reset Password"
              onPress={() => handleResetPassword()}
              loader={loading}
            />
            <Text
              style={styles.login_link}
              onPress={() => navigation.navigate('Login')}>
              Back to Login
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
  bottomContent: {
    flex: 1,
    paddingHorizontal: 16,
    // justifyContent: 'center',
    // alignItems:'center',
    width: '100%',
  },
  login_link: {
    color: colors.white,
    textAlign: 'right',
    fontSize: 12,
    marginRight: 10,
    fontFamily: fonts.normal,
    textDecorationLine: 'underline',
  },
});

export default ResetPasswordScreen;
