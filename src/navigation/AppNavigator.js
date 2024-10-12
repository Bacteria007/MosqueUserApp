import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      <Stack.Screen name="MainNavigator" component={MainNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
