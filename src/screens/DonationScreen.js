import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import CommonStyles from '../assets/styles/CommonStyles';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import DonationTextinput from '../components/inputs/DonationTextinput';
import MyImages from '../assets/images/MyImages';
import { Icons } from '../assets/icons/Icons';
import ReactNativeModal from 'react-native-modal';
import PrimaryButton from '../components/buttons/PrimaryButton';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import WhiteStatusbar from '../components/statusbar/WhiteStatusbar';
import AppHeader from '../components/headers/AppHeader';

const DonationScreen = () => {
  const inputsGap = 20;
  const [step, setStep] = useState(1); // 1: Amount, 2: User Info, 3: Card Details
  const [donationAmount, setDonationAmount] = useState(100);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const DonationTypes = {
    ZAKAT: 'Zakat/Fitrana',
    SADQA: 'Sadqa',
  };
  const [donationType, setDonationType] = useState(DonationTypes.ZAKAT);
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const openDonationModal = () => setIsModalVisible(true);

  const closeDonationModal = () => {
    if (customAmount && parseInt(customAmount) > 0) {
      setDonationAmount(parseInt(customAmount));
    }
    setCustomAmount('');
    setIsModalVisible(false);
  };

  const onDismiss = () => {
    setCustomAmount('');
    setIsModalVisible(false);
  };

  const handleDonateNow = () => {
    const donationPayload = {
      amount: donationAmount,
      donationType, // Zakat or Sadqa
      name,
      contact,
      email,
      cardDetails: {
        cardNumber,
        expiryDate,
        nameOnCard,
        cvv,
      },
    };
    console.log('Donation Payload: ', donationPayload);
    // Trigger your API call here with donationPayload
  };

  return (
    <SafeAreaView style={[CommonStyles.container]}>
      <TransparentStatusbar />
      <AppHeader />
      <MainScreensHeader title={'Donate'} />
      <View style={{ flex: 1, justifyContent: 'center' }}>

        <Text style={styles.undertext}>This feature is under development</Text>
      </View>
      {/* {step == 1 && (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={[styles.bottomSection, {justifyContent: 'space-around'}]}>
            <View>
              <View style={styles.radioGroup}>
                <View style={styles.radioButtonContainer}>
                  <Pressable
                    onPress={() => setDonationType(DonationTypes.SADQA)}
                    style={[
                      styles.radioButton,
                      donationType === DonationTypes.SADQA &&
                        styles.radioButtonSelected,
                    ]}>
                    {donationType === DonationTypes.SADQA ? (
                      <Icons.Ionicons
                        name={'radio-button-on'}
                        color={colors.primary}
                        size={20}
                      />
                    ) : (
                      <Icons.Ionicons
                        name={'radio-button-off'}
                        color={colors.primary}
                        size={20}
                      />
                    )}
                    <Text style={styles.radioButtonText}>Sadqa</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDonationType(DonationTypes.ZAKAT)}
                    style={[
                      styles.radioButton,
                      // donationType === DonationTypes.ZAKAT &&
                      styles.radioButtonSelected,
                    ]}>
                    {donationType === DonationTypes.ZAKAT ? (
                      <Icons.Ionicons
                        name={'radio-button-on'}
                        color={colors.primary}
                        size={20}
                      />
                    ) : (
                      <Icons.Ionicons
                        name={'radio-button-off'}
                        color={colors.primary}
                        size={20}
                      />
                    )}
                    <Text style={styles.radioButtonText}>Zakat/Fitrana</Text>
                  </Pressable>
                </View>
              </View>
              <DonationTextinput
                style={{marginBottom: 20}}
                setState={setDonationAmount}
                state={donationAmount}
                placeholder={`Donation Amount`}
                keyboard="numeric"
              />
              <DonationTextinput
                style={{marginBottom: 20}}
                state={name}
                setState={setName}
                placeholder="Name"
              />
              <DonationTextinput
                style={{marginBottom: 20}}
                state={contact}
                setState={setContact}
                placeholder="Contact"
              />
              <DonationTextinput
                style={{marginBottom: 20}}
                state={email}
                setState={setEmail}
                placeholder="Email"
              />
            </View>
            <Pressable
              style={styles.buttonContainer}
              onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {step == 2 && (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.bottomSection}>
            <DonationTextinput
              state={cardNumber}
              setState={setCardNumber}
              placeholder="Card Number"
              style={{marginBottom: inputsGap, marginTop: 20}}
            />

            <DonationTextinput
              state={nameOnCard}
              setState={setNameOnCard}
              placeholder="Name on Card"
              style={{marginBottom: inputsGap}}
            />
            <DonationTextinput
              state={cvv}
              setState={setCvv}
              placeholder="CVV"
              style={{marginBottom: inputsGap}}
            />
            <Text style={[styles.radioButtonText, {marginBottom: 5}]}>
              Expiry Date
            </Text>
            <View style={{flexDirection: 'row', marginBottom: inputsGap}}>
              <DonationTextinput
                state={expiryDate}
                setState={setExpiryDate}
                placeholder="Month"
              />
              <Text style={styles.buttonText}> / </Text>
              <DonationTextinput
                state={expiryDate}
                setState={setExpiryDate}
                placeholder="Date"
              />
            </View>
          </View>
          <View style={styles.bottomButtonsContainer}>
            <Pressable style={styles.backBtn} onPress={() => setStep(1)}>
              <Text style={[styles.buttonText, {color: colors.black}]}>
                Back
              </Text>
            </Pressable>
            <Pressable style={styles.donateBtn} onPress={handleDonateNow}>
              <Text style={styles.buttonText}>Donate</Text>
            </Pressable>
          </View>
        </ScrollView>
      )} */}

      <ReactNativeModal
        statusBarTranslucent
        visible={isModalVisible}
        style={{ margin: 0, flex: 1 }}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onDismiss={onDismiss}
        onBackButtonPress={onDismiss}
        onBackdropPress={onDismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={MyImages.masjid}
              style={{
                height: 60,
                width: 60,
                borderRadius: 99,
                resizeMode: 'cover',
              }}
            />
            <Text style={styles.modalTitle}>Enter Custom Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholderTextColor={colors.white}
            />
            <PrimaryButton title={'OK'} onPress={closeDonationModal} />
          </View>
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  undertext: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.light_black,
    textAlign: 'center'
  },
  radioGroup: {
    marginTop: 20,
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    // marginBottom: 10,
    color: colors.white,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioButton: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '44%', // 48% to have 2 buttons in one row
    alignItems: 'center',
    backgroundColor: colors.light_white,
    flexDirection: 'row',
    gap: 5,
  },
  radioButtonSelected: {
    // backgroundColor:colors.secondary
  },
  radioButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    // gap: 20,
    paddingHorizontal: 20,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // This will ensure space at the bottom
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    width: '100%',
  },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 8,
    width: '30%',
  },
  donateBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    width: '30%',
  },

  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.medium,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  circle: {
    width: 58,
    height: 58,
    margin: 2,
    borderRadius: 99,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  circleText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.white,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 50,
    color: colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: colors.light_white,
  },
  modalButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: fonts.medium,
  },
});

export default DonationScreen;
