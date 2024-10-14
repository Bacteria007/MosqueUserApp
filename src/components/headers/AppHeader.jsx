import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { appName } from '../../services/constants'
import MyImages from '../../assets/images/MyImages'
import colors from '../../assets/colors/AppColors'
import fonts from '../../assets/fonts/MyFonts'

const AppHeader = () => {
    return (
        <View style={styles.continer}>
            <Image
                source={MyImages.logo}
                style={styles.logo}
                resizeMode="cover"
            />
            <Text style={styles.title} ellipsizeMode="tail">
                {appName}
            </Text>
        </View>
    )
}

export default AppHeader

const styles = StyleSheet.create({
    continer: { flexDirection: 'row', gap: 5, marginTop: StatusBar.currentHeight, height: 50, alignItems: "center" },
    title: {
        fontSize: 14,
        color: colors.black,
        fontFamily: fonts.medium,
    },
    logo: { height: '100%', width: '20%', resizeMode: 'center' },

})