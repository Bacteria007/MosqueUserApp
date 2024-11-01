import { Image, StatusBar, StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import React from 'react';
import colors from '../../assets/colors/AppColors';
import fonts from '../../assets/fonts/MyFonts';
import MyImages from '../../assets/images/MyImages';

const { height } = Dimensions.get('window')
const headerCardHeight = height < 630 ? height * 0.2 : height * 0.25;

const MainScreensHeader = ({ title, subTitle = '',style }) => {
    return (
        <View style={[styles.mainCard2,{...style}]}>
            <ImageBackground
                source={MyImages.bgheader}
                style={styles.imageBackground}
                resizeMode="cover"
            >
                <View style={styles.overlayContainer}>

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.appName}>{title}</Text>
                        {subTitle != '' && <Text style={styles.title}>{subTitle}</Text>}
                    </View>
                </View>
            </ImageBackground>

        </View>
    );
};


export default MainScreensHeader;

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject, // Makes the overlay cover the entire ImageBackground
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    mainCard2: {
        margin: 14,
        borderRadius: 10,
        height: headerCardHeight,
        overflow: 'hidden',
    },
    gcontainer: {
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
        fontSize: 18,
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
