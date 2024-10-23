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

const Tab = createBottomTabNavigator();
const activeColor = colors.primary;
const inactiveColor = colors.tab_inactive;
const iconSize = 22;

const MainNavigator = () => (
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
        borderTopWidth:0,
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
        }
         else if (route.name === 'Donate') {
          return (
            <Icons.FontAwesome5
              size={21}
              name={'hand-holding-heart'}
              color={iconColor}
            />
          );
        }
         else if (route.name === 'Settings') {
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
    <Tab.Screen name="Prayer Times" options={{title:"Times"}} component={PrayerTimesScreen} />
    <Tab.Screen name="Qibla" component={QiblaScreen} />
    <Tab.Screen name="Mosque Location" options={{title:"Location"}} component={MosqueLocationScreen} />
    <Tab.Screen name="Donate" component={DonationScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default MainNavigator;
