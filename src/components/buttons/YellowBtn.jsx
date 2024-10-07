import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../assets/colors/AppColors'
import MyImages from '../../assets/images/MyImages'
import fonts from '../../assets/fonts/MyFonts'
import LottieView from 'lottie-react-native'

const YellowBtn = ({ title, onPress, loader }) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.btnStyle]}>
            {loader ? (
                // <ActivityIndicator size="small" color="white" />
                <LottieView
                    style={{ height: 30, width: 30 }}
                    source={MyImages.loader}
                    autoPlay
                    loop={true}
                />
            ) : (
                <Text style={styles.titleStle}>{title}</Text>
            )}
        </Pressable>
    )
}

export default YellowBtn

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

    titleStle: {
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.semibold,
    },
})