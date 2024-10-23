import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MyImages from '../../assets/images/MyImages';
import { Icons } from '../../assets/icons/Icons';
import fonts from '../../assets/fonts/MyFonts';
import WhiteStatusbar from '../statusbar/WhiteStatusbar';

const { height } = Dimensions.get('window')
const headerHeight = height < 630 ? height * 0.45 : height * 0.50;

const AuthHeader = ({ title, style }) => {
    const navigation = useNavigation();

    return (
        <>
            <WhiteStatusbar />
            <ImageBackground
                source={MyImages.bgheader}
                style={[styles.imageBackground, { ...style }]}
                resizeMode="cover" resizeMethod='resize'
            >
                <View style={styles.header}>
                    {/* Back button with chevron icon */}
                    {/* <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icons.Entypo name="chevron-left" size={24} color="#fff" />
        </Pressable> */}

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>
                </View>
            </ImageBackground>
        </>

    );
};

export default AuthHeader;

const styles = StyleSheet.create({
    imageBackground: {
        height: headerHeight,
        width: '100%',
        paddingTop: StatusBar.currentHeight + 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop:15
    },
    backButton: {
        paddingRight: 20,
    },
    title: {
        fontSize: 18,
        color: '#fff',
        fontFamily: fonts.normal
    },
});
