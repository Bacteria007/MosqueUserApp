import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import MyImages from '../assets/images/MyImages';
import fonts from '../assets/fonts/MyFonts';
import colors from '../assets/colors/AppColors';

// Get screen width for dynamic styling
const {width} = Dimensions.get('window');

const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View style={styles.headerContainer}>
        <Image
          source={MyImages.logo_trans} // Logo image path
          style={styles.logo}
          resizeMode="contain"
          tintColor={colors.white}
        />
        {/* <Text style={styles.appName}>Mosque App</Text> */}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width:150,
    height: 150,
  },
  appName: {
    fontSize: 20,
    fontFamily: fonts.bold,
    marginTop: 10,
    color: '#000', // Adjust text color to match the background
  },
});

export default CustomDrawerContent;
