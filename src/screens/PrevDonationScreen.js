// src/screens/DonationScreen.js
import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert, Text} from 'react-native';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import api from '../services/api';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import AuthTextinput from '../components/inputs/AuthTextinput';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import MyButton from '../components/buttons/PrimaryButton';
import YellowBtn from '../components/buttons/YellowBtn';

const DonationScreen = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const {confirmPayment} = useConfirmPayment();

  const handleDonate = async () => {
    setLoading(true);
    try {
      // Create payment intent on your backend
      const response = await api.post('/donations/create-payment-intent', {
        amount: parseInt(amount) * 100, // Convert to cents
        currency: 'usd',
      });
      const clientSecret = response.data.clientSecret;

      // Confirm the payment
      const {paymentIntent, error} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Payment successful', 'Thank you for your donation!');
        setAmount('');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing your donation.');
      console.error('Donation error', error);
    }
    setLoading(false);
  };

  return (
    <View style={[CommonStyles.container]}>
      <MainScreensHeader title={'Donation'} />
      <View style={{paddingHorizontal:16,flex:1,justifyContent:'center'}}>
{/*      
      <AuthTextinput
        placeholder="Donation Amount (USD)"
        state={amount}
        setState={setAmount}
        keyboard="numeric"
        // style={styles.input}
      /> */}
      <TextInput
        placeholder="Donation Amount (USD)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
        <CardField
          postalCodeEnabled={false}
          placeholder={{number: '4242 4242 4242 4242'}}
          cardStyle={styles.card}
          style={styles.cardContainer}
        />
        <YellowBtn
          title="Donate"
          onPress={() => handleDonate()}
          loader={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {fontSize: 24, marginBottom: 20, textAlign: 'center'},
  input: {borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5,backgroundColor:colors.white},
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 5,
  },
  cardContainer: {height: 50, marginBottom: 15},
});

export default DonationScreen;
