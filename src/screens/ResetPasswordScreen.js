import React, {useEffect, useState} from 'react';
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
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import api from '../services/api';
import CommonStyles from '../assets/styles/CommonStyles';
import MyTextInput from '../components/inputs/MyTextInput';
import YellowBtn from '../components/buttons/YellowBtn';
import MyImages from '../assets/images/MyImages';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import WhiteStatusbar from '../components/statusbar/WhiteStatusbar';
import PrimaryButton from '../components/buttons/PrimaryButton';

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
      <View style={CommonStyles.authHeader}>
        <Text style={CommonStyles.authTitle}>Reset Password</Text>
        <Text style={CommonStyles.authSubtitle}>Reset Your password!</Text>
      </View>
      <View style={CommonStyles.authBottomConatiner}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <MyTextInput
            placeholder="Enter your email"
            state={email}
            setState={setEmail}
            keyboard="email-address"
            autoCapitalize="none"
            style={{marginBottom: 0}}
          />
          {emailError && (
            <Text style={CommonStyles.errorText}>{emailError}</Text>
          )}

          <PrimaryButton
            title="Reset Password"
            onPress={() => handleResetPassword()}
            loader={loading}
          />
          {/* Back to Login link at the bottom */}
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
    backgroundColor: colors.bg_clr,
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

export default ResetPasswordScreen;
