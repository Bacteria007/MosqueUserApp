import {StatusBar} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/AppColors';

const TransparentStatusbar = () => {
  return (
    <StatusBar backgroundColor={colors.bg_clr} barStyle={'dark-content'} />
  );
};

export default TransparentStatusbar;
