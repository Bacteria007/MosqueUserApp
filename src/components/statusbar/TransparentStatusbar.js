import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const TransparentStatusbar = () => {
  return (
    <StatusBar
      backgroundColor={'transparent'}
      translucent
      barStyle={'light-content'}
    />
  );
};

export default TransparentStatusbar;

const styles = StyleSheet.create({});
