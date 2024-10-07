// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator  screenOptions={{headerShown:false}}>
    <Stack.Screen name="Splash" component={SplashScreen}   />
    <Stack.Screen name="Welcome" component={WelcomeScreen}   />
    <Stack.Screen name="Login" component={LoginScreen}  />
    <Stack.Screen name="Signup" component={SignupScreen}  />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}  />
  </Stack.Navigator>
);

export default AuthNavigator;
