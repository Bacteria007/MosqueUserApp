import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../assets/colors/AppColors'
import MyImages from '../../assets/images/MyImages'
import fonts from '../../assets/fonts/MyFonts'
import LottieView from 'lottie-react-native'

const PrimaryButton = ({ title, onPress, loader }) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.btnStyle,
                { backgroundColor: colors.img1, marginTop: 5 },
            ]}>
            {loader ? (
                <LottieView
                    style={{ height: 30, width: 30 }}
                    source={MyImages.loading1}
                    autoPlay
                    loop={true}
                />
            ) : (
                <Text style={styles.titleStle}>{title}</Text>
            )}
        </Pressable>
    )
}

export default PrimaryButton

const styles = StyleSheet.create({
    btnStyle: {
        padding: 10,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        //   opacity: 0.5,
        width: '100%',
        marginBottom: 10,
        backgroundColor: colors.secondary,

    },
    btnStyle: {
        padding: 10,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colors.secondary,
        marginTop: 5,
        alignItems: 'center',
        shadowOffset: { width: 10, height: -5 },
        shadowOpacity: 0.1,
        shadowColor: '#1B74D6',
        shadowRadius: 10,
        elevation: 4,
    },
    titleStle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        fontFamily: fonts.semibold,
        color: colors.white,
    }
})