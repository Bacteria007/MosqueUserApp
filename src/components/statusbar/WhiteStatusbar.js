import { StatusBar } from 'react-native';
import React from 'react';

const WhiteStatusbar = () => {
  return (
    <StatusBar
      backgroundColor="transparent"
      translucent 
      barStyle="light-content"
    />
  );
};

export default WhiteStatusbar;
