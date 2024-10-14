import { Image, StatusBar, StyleSheet, Text, View, ImageBackground } from 'react-native';
import React from 'react';
import colors from '../../assets/colors/AppColors';
import fonts from '../../assets/fonts/MyFonts';
import { appName } from '../../services/constants';
import MyImages from '../../assets/images/MyImages';
import LinearGradient from 'react-native-linear-gradient';

const MainScreensHeader = ({ title, subTitle = '' }) => {
    // <LinearGradient colors={['#042334', '#006665']} style={styles.gcontainer}>
    return (
        <View style={styles.mainCard2}>
            <ImageBackground
                source={MyImages.bgheader} // Your background image path
                style={styles.imageBackground}
                resizeMode="cover" // Controls how the image fits
            >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.appName}>{title}</Text>
                    {subTitle != '' && <Text style={styles.title}>{subTitle}</Text>}
                    <Text style={styles.subTitle}>Stay Connected with Your Faith</Text>
                </View>
            </ImageBackground>

        </View>
    );
};


export default MainScreensHeader;

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 14,
        borderRadius: 15,
        // paddingTop: StatusBar.currentHeight,
    },
    mainCard2: {
        // flex: 1,
        margin: 14,
        borderRadius: 15,
        height: 180,
        overflow: 'hidden',
    },
    gcontainer: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 25,
        margin: 14,
        borderRadius: 15,
        height: 180,
        overflow: 'hidden',

    },

    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 280,
        backgroundColor: colors.primary,
        paddingTop: StatusBar.currentHeight,
        shadowColor: colors.white,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    image: { height: '100%', width: '100%', resizeMode: 'cover' },
    imgCard: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.img3,
        opacity: 1,
        height: 120,
        overflow: 'hidden',
        width: 120,
        borderRadius: 999,
        shadowColor: colors.white,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    appName: {
        fontSize: 20,
        fontFamily: fonts.semibold,
        color: colors.white,
        textAlign: 'center',
    },
    title: {
        fontSize: 16,
        fontFamily: fonts.semibold,
        textAlign: 'center',
        color: colors.white,
    },
    subTitle: {
        fontSize: 12,
        fontFamily: fonts.normal,
        textAlign: 'center',
        color: colors.white,
    }
});
