import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts/MyFonts';
import colors from '../../assets/colors/AppColors';

const MyTextInput = ({
    placeholder,
    state,
    setState,
    keyboard, style, secureTextEntry = false
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
            importantForAutofill='off'
        />
    );
};

export default MyTextInput;

const styles = StyleSheet.create({
    inputStyle: {
        padding: 12,
        paddingLeft: 16,
        marginBottom: 10,
        borderRadius: 99,
        backgroundColor: colors.light_white,
        fontFamily: fonts.normal,
        fontSize: 14,
        color: colors.white,
    }
})
