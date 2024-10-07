import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../assets/colors/AppColors'
import MyImages from '../../assets/images/MyImages'

const MyButton = ({ title, onPress, loader }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.btnStyle,
                { backgroundColor: colors.primary, marginTop: 20 },
            ]}>
            {loader ? (
                <ActivityIndicator size="small" color="white" />
                // <LottieView
                //     style={{ height: 30, width: 30 }}
                //     source={MyImages.loader}
                //     autoPlay
                //     loop={true}
                // />
            ) : (
                <Text style={styles.titleStle}>{title}</Text>
            )}
        </TouchableOpacity>
    )
}

export default MyButton

const styles = StyleSheet.create({
    btnStyle: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2EAF0',
        flexDirection: 'row',
        height: 20,
        width: '90%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        width: '90%',
        height: '6.3%',
        marginTop: 5,
        alignItems: 'center',
        shadowOffset: { width: 10, height: -5 },
        shadowOpacity: 0.1,
        shadowColor: '#1B74D6',
        shadowRadius: 10,
        elevation: 4,
    },
    titleStle:{
        // fontFamily: FontFam.mediumFont,
        fontWeight: '600',
        textAlign: 'center',
        textAlignVertical: 'center',

        // fontSize: FontSize.mediumText,
        color: colors.white,
    }
})