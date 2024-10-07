import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MyImages from '../../assets/images/MyImages'
import colors from '../../assets/colors/AppColors'
import fonts from '../../assets/fonts/MyFonts'

const MainScreensHeader = ({ title, subTitle='Stay Connected with Your Faith' }) => {
    const appName = 'Islamiya Mosque'
    return (
        <View style={styles.container}>
            <View style={styles.imgCard}>
                <Image
                    source={MyImages.masjid}
                    style={styles.image}
                />
            </View>
            <View>

                <Text style={styles.appName}>{appName}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subTitle}>{subTitle}</Text>
            </View>
        </View>
    )
}

export default MainScreensHeader

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg_clr,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        paddingTop:60,paddingBottom:20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        // Elevation for Android
        elevation: 10,
    },
    image: { height: '100%', width: '100%', resizeMode: 'cover' },
    imgCard: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        opacity: 1,
        // padding: 8,
        height: 120,
        overflow: 'hidden',
        width: 120,
        borderRadius: 999,
        // Shadow properties for iOS
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // Elevation for Android
        elevation: 4,
    },
    appName: {
        fontSize: 24,
        fontFamily: fonts.bold,
        color: colors.white,
        textAlign: 'center'
    },
    title: {
        fontSize: 18,
        fontFamily: fonts.semibold,
        textAlign: 'center',
        color: colors.white
    },
    subTitle: {
        fontSize: 12,
        fontFamily: fonts.normal,
        textAlign: 'center',
        color: colors.white
    }
})