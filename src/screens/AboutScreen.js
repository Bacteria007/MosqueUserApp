import React from 'react';
import {View, Text, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AppHeader from '../components/headers/AppHeader';
import MainScreensHeader from '../components/headers/MainScreensHeader';

const AboutScreen = () => {
  return (
    <SafeAreaView style={CommonStyles.container}>
      <TransparentStatusbar />
      <AppHeader />
      <ScrollView style={styles.scrollContainer}>
        {/* <MainScreensHeader title="About Us" /> */}
        <Text style={styles.heading}>At a Glance</Text>
        <Text style={styles.paragraph}>
          At a glance Markazi Jamia Ghausia Masjid has a rich history spanning
          more than half a century. It is Nelson’s oldest Mosque, serving
          communities in the heart of the Nelson and beyond{' '}
          <Text style={styles.highlight}>since 1964</Text>The masjid aims to
          provide a welcoming space for spiritual growth, congregate for daily
          prayers and foster a sense of love and unity. This app will provide
          you with information on some of the services we offer as well as daily
          prayer reminders. We would welcome your feedback.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    lineHeight: 24,
    marginBottom: 16,
  },
  highlight: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});
