// GradientButton.js
import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../assets/fonts/MyFonts';

const GradientButton = ({ onPress, title,style }) => {
  return (
    <LinearGradient
      colors={['#FCA625', '#966316']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradientButton,{...style}]}>
      <Pressable onPress={onPress} style={styles.btn}>
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </LinearGradient>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '100%',
    height: 50,
    borderRadius: 99,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: fonts.semibold,
    textAlign:'center'
  },
  btn:{
    justifyContent:'center',alignItems:'center',
    paddingHorizontal:30
  }
})
