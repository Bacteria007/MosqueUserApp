import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts/MyFonts';
import colors from '../../assets/colors/AppColors';

const DonationTextinput = ({
    placeholder,
    state,
    setState,
    keyboard = 'default', style, secureTextEntry = false
}) => {
    return (
        <TextInput
            value={state}
            onChangeText={t => setState(t)}
            placeholder={placeholder}
            placeholderTextColor={colors.white}
            style={[styles.inputStyle, { ...style }]}
            keyboardType={`${keyboard}`}
            autoCapitalize='none'
            underlineColorAndroid="transparent"
            secureTextEntry={secureTextEntry}
        />

    );
};

export default DonationTextinput;

const styles = StyleSheet.create({
    inputStyle: {
        padding: 10,
        paddingHorizontal: 16,
        marginBottom: 5,
        borderRadius: 8,
        backgroundColor: colors.light_white,
        fontFamily: fonts.normal,
        fontSize: 12,
        color: colors.white,
    }
})
