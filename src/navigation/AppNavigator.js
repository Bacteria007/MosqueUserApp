// src/navigation/AppNavigator.js
import React from 'react';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const isLoggedIn = false;
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return isLoggedIn ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
