import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Icons} from '../assets/icons/Icons'; // Assuming your icons are imported here
import colors from '../assets/colors/AppColors';
import fonts from '../assets/fonts/MyFonts';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AppHeader from '../components/headers/AppHeader';
import MainScreensHeader from '../components/headers/MainScreensHeader';

const ContactScreen = () => {
  const openEmail = () => {
    Linking.openURL('mailto:info@nelsonghausiatrust.co.uk');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TransparentStatusbar />
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainScreensHeader
          title="Contact Us"
          style={{margin: 0, padding: 0, marginBottom: 20}}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Markazi Jamia Ghausia Masjid</Text>
          <View style={styles.iconTextRow}>
            <Icons.FontAwesome
              name="building"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.contactText}>Clayton Street</Text>
          </View>
          <View style={styles.iconTextRow}>
            <Icons.MaterialIcons
              name="location-pin"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.contactText}>Nelson, Lancashire BB9 7PR</Text>
          </View>
          <View style={styles.iconTextRow}>
            <Icons.FontAwesome name="phone" size={18} color={colors.primary} />
            <Text style={styles.contactText}>01282 614976</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghausia Madrassa</Text>
          <View style={styles.iconTextRow}>
            <Icons.FontAwesome5
              name="school"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.contactText}>Barkerhouse Road,</Text>
          </View>
          <View style={styles.iconTextRow}>
            <Icons.MaterialIcons
              name="location-pin"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.contactText}>Nelson, Lancashire</Text>
            <Text style={styles.contactText}>BB9 9ES</Text>
          </View>
          <View style={styles.iconTextRow}>
            <Icons.FontAwesome name="phone" size={18} color={colors.primary} />
            <Text style={styles.contactText}>01282 761505</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Silverman Hall Community Centre
          </Text>
          <View style={styles.iconTextRow}>
            <Icons.FontAwesome
              name="building-o"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.contactText}>Pendle Street</Text>
          </View>
          <View style={styles.iconTextRow}>
            <Icons.MaterialIcons
              name="location-pin"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.contactText}>Nelson, Lancashire</Text>
            <Text style={styles.contactText}>BB9 7NH</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            To enquire about booking Silverman Hall Community Centre please
            email us at
          </Text>
          <TouchableOpacity onPress={openEmail} style={styles.emailRow}>
            <Icons.FontAwesome
              name="envelope"
              size={18}
              color={colors.primary}
            />
            {/* <Text style={styles.text}></Text> */}
            <Text style={styles.emailLink}>ghausiamasjidnelson@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lighr_grey,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 10,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    fontFamily: fonts.normal,
    color: colors.black,
    marginLeft: 8,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  emailLink: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginLeft: 8,
  },
});
