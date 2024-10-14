import {StatusBar} from 'react-native';
import React from 'react';

const TransparentStatusbar = () => {
  return (
    <StatusBar
      backgroundColor={'transparent'}
      translucent
      barStyle={'dark-content'}
    
    />
  );
};

export default TransparentStatusbar;