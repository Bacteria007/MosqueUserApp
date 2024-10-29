import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import CommonStyles from '../assets/styles/CommonStyles';
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AppHeader from '../components/headers/AppHeader';
import MainScreensHeader from '../components/headers/MainScreensHeader';

const AboutScreen = () => {
  return (
    <View style={CommonStyles.container}>
      <TransparentStatusbar />
      <AppHeader />
      <ScrollView style={styles.scrollContainer}>
        {/* <MainScreensHeader title="About Us" /> */}
        <Text style={styles.heading}>At a Glance</Text>
        <Text style={styles.paragraph}>
          Markazi Jamia Ghausia Masjid, part of the Nelson Ghausia Trust, has a
          rich history spanning more than half a century. It is Nelson’s oldest
          Mosque, serving communities in the heart of Nelson and beyond{' '}
          <Text style={styles.highlight}>since 1964</Text>. The trust also
          operates the Ghausia Madrassa and Silverman Hall Community Centre.
        </Text>

        <Text style={styles.heading}>Our Mission</Text>
        <Text style={styles.paragraph}>
          We aim to provide a space for spiritual growth and foster unity within
          the community through various programs, education, and social events.
        </Text>

        <Text style={styles.paragraph}>
          Our mosque continues to inspire generations, helping them stay connected
          to their faith while contributing positively to society.
        </Text>
      </ScrollView>
    </View>
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
