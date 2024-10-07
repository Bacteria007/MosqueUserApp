import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonStyles from '../assets/styles/CommonStyles';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import DonationTextinput from '../components/inputs/DonationTextinput';
import GradientButton from '../components/buttons/GradientButton';
import MyImages from '../assets/images/MyImages';
import {Icons} from '../assets/icons/Icons';
import MyTextInput from '../components/inputs/MyTextInput';

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
    <View style={[CommonStyles.container]}>
      <MainScreensHeader title={'Donation'} />

      {/* Conditional rendering based on the step */}
      {step === 1 && (
        <View style={[styles.bottomSection, {justifyContent: 'space-around'}]}>
          {/* amount */}
          {/* <View style={[styles.buttonContainer, {marginBottom: inputsGap}]}>
            <LinearGradient
              colors={['#FCA625', '#966316']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>Donation Amount</Text>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{donationAmount}</Text>
              </View>
            </LinearGradient>
          </View> */}
          <View>
            <Text style={styles.modalTitle}>Donation Amount</Text>
            <DonationTextinput
              setState={setDonationAmount}
              state={donationAmount}
              placeholder={`${donationAmount}`}
              keyboard="numeric"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: inputsGap,
              }}>
              <Pressable
                onPress={() => setDonationAmount(10)}
                style={styles.circle}>
                <Text style={styles.circleText}>10</Text>
              </Pressable>
              <Pressable
                onPress={() => setDonationAmount(50)}
                style={styles.circle}>
                <Text style={styles.circleText}>50</Text>
              </Pressable>
              <Pressable
                onPress={() => setDonationAmount(100)}
                style={styles.circle}>
                <Text style={styles.circleText}>100</Text>
              </Pressable>
              <Pressable onPress={openDonationModal} style={styles.circle}>
                <Text style={styles.circleText}>Other</Text>
              </Pressable>
            </View>
          </View>
          {/* <GradientButton onPress={() => setStep(2)} title="Next" /> */}


          <Pressable style={styles.buttonContainer} onPress={() => setStep(2)}>
            <LinearGradient
              colors={['#FCA625', '#966316']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.gradientButton, {justifyContent: 'center'}]}>
              <Text style={styles.buttonText}>Next</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      {step === 2 && (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.bottomSection}>
            {/* Radio buttons for donation type */}
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
                      color={colors.white}
                      size={20}
                    />
                  ) : (
                    <Icons.Ionicons
                      name={'radio-button-off'}
                      color={colors.white}
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
                      color={colors.white}
                      size={20}
                    />
                  ) : (
                    <Icons.Ionicons
                      name={'radio-button-off'}
                      color={colors.white}
                      size={20}
                    />
                  )}
                  <Text style={styles.radioButtonText}>Zakat/Fitrana</Text>
                </Pressable>
              </View>
            </View>
            {/* User info */}
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

          {/* Back and Next buttons at the bottom */}
          <View style={styles.bottomButtonsContainer}>
            <GradientButton onPress={() => setStep(1)} title="Back" />
            <GradientButton onPress={() => setStep(3)} title="Next" />
          </View>
        </ScrollView>
      )}

      {step === 3 && (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.bottomSection}>
            {/* card details */}
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

          {/* Back and Donate Now buttons at the bottom */}
          <View style={styles.bottomButtonsContainer}>
            <GradientButton onPress={() => setStep(2)} title="Back" />
            <GradientButton onPress={handleDonateNow} title="Donate Now" />
          </View>
        </ScrollView>
      )}

      {/* Modal for Custom Donation Amount */}
      <Modal
        statusBarTranslucent
        onDismiss={onDismiss}
        visible={isModalVisible}
        transparent
        animationType="fade">
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
            <GradientButton title={'OK'} onPress={closeDonationModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  radioGroup: {
    marginTop: 0,
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
    color: colors.white,
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
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '28%',
    height: 50,
    borderRadius: 99,
    // paddingLeft: 20,
    alignSelf: 'flex-end',
  },
  // gradientButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   width: '100%',
  //   height: 60,
  //   borderRadius: 99,
  //   paddingLeft: 20,
  // },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.semibold,
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
