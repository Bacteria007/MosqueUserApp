// src/navigation/MainNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import QiblaScreen from '../screens/QiblaScreen';
import MosqueLocationScreen from '../screens/MosqueLocationScreen';
import DonationScreen from '../screens/DonationScreen';
import colors from '../assets/colors/AppColors';
import {Icons} from '../assets/icons/Icons';
import fonts from '../assets/fonts/MyFonts';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ContactScreen from '../screens/ContactScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const activeColor = colors.primary;
const inactiveColor = colors.tab_inactive;
const iconSize = 22;

const iconColorD = colors.white;
// const iconColorD = 'rgba(0,0,0,0.6)';
const iconSizeD = 15;
const HomeTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 6,
        marginTop: 0,
        fontFamily: fonts.semibold,
      },
      tabBarItemStyle: {
        backgroundColor: colors.white,
      },
      tabBarStyle: {
        height: 60,
        // borderTopColor:colors.primary,
        borderTopWidth: 0,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        // Elevation for Android
        elevation: 10,
      },
      tabBarActiveTintColor: activeColor,
      tabBarInactiveTintColor: inactiveColor,
      tabBarHideOnKeyboard: 'true',
      tabBarPressColor: 'rgba(255,255,255,0.6)',
      tabBarIcon: ({focused}) => {
        let iconColor = focused ? activeColor : inactiveColor;
        if (route.name === 'Prayer Times') {
          return (
            <Icons.FontAwesome5
              size={iconSize}
              name={'mosque'}
              color={iconColor}
            />
          );
        } else if (route.name === 'Qibla') {
          return (
            <Icons.MaterialCommunityIcons
              size={iconSize}
              name={'directions'}
              color={iconColor}
            />
          );
        } else if (route.name === 'Mosque Location') {
          return (
            <Icons.MaterialIcons
              size={21}
              name={'location-pin'}
              color={iconColor}
            />
          );
        } else if (route.name === 'Donate') {
          return (
            <Icons.FontAwesome5
              size={19}
              // name={'info-with-circle'}
              name={'hand-holding-heart'}
              color={iconColor}
            />
          );
        } else if (route.name === 'Settings') {
          return (
            <Icons.MaterialIcons
              size={21}
              name={'settings'}
              color={iconColor}
            />
          );
        }
      },
    })}>
    <Tab.Screen
      name="Prayer Times"
      options={{title: 'Times'}}
      component={PrayerTimesScreen}
    />
    <Tab.Screen name="Qibla" component={QiblaScreen} />
    <Tab.Screen
      name="Mosque Location"
      options={{title: 'Location'}}
      component={MosqueLocationScreen}
    />
    <Tab.Screen name="Donate" component={DonationScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const MainNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: '65%',
        backgroundColor: colors.primary
        // backgroundColor: '#D4EBCC',
      },
      drawerActiveBackgroundColor: 'rgba(255,255,255,0.4)',
      drawerLabelStyle: {
        fontFamily: fonts.medium,
        fontSize: 12,
        color: colors.white,
        marginLeft: -15,
      },
    }}>
    <Drawer.Screen
      name="Home"
      options={{
        drawerIcon: ({color, size}) => (
          <Icons.Octicons name="home" size={iconSizeD} color={iconColorD} />
        ),
      }}
      component={HomeTabNavigator}
    />
    <Drawer.Screen
      name="About"
      options={{
        drawerIcon: ({color, size}) => (
          <Icons.SimpleLineIcons
            name="info"
            size={iconSizeD}
            color={iconColorD}
          />
        ),
      }}
      component={AboutScreen}
    />
    <Drawer.Screen
      options={{
        drawerIcon: ({color, size}) => (
          <Icons.AntDesign
            name="contacts"
            size={iconSizeD}
            color={iconColorD}
          />
        ),
      }}
      name="Contact"
      component={ContactScreen}
    />
  </Drawer.Navigator>
);

export default MainNavigator;
