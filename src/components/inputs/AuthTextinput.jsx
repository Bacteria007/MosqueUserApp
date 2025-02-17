import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import fonts from '../../assets/fonts/MyFonts';
import colors from '../../assets/colors/AppColors';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you have this installed

const AuthTextinput = ({
    placeholder,
    state,
    setState,
    keyboard,
    style,
    secureTextEntry = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.inputContainer, { ...style }]}>
            <TextInput
                value={state}
                onChangeText={t => setState(t.trim())}
                placeholder={placeholder}
                placeholderTextColor={colors.white}
                style={styles.inputStyle}
                keyboardType={keyboard}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                secureTextEntry={secureTextEntry && !showPassword}
                importantForAutofill="off"
            />
            {secureTextEntry && (
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIconContainer}
                >
                    <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color={colors.white}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default AuthTextinput;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(22,122,136,0.3)',
        borderRadius: 999,
        paddingLeft: 8,
        paddingRight: 16,
        marginBottom: 10,
    // marginHorizontal: 16,
    },
    inputStyle: {
        flex: 1,
        padding: 10,
        fontFamily: fonts.normal,
        fontSize: 14,
        color: colors.white,
        width:'100%'
    },
    eyeIconContainer: {
        marginLeft: 10,
    },
});
