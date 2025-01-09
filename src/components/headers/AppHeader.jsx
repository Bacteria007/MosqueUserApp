import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { appName } from '../../services/constants';
import MyImages from '../../assets/images/MyImages';
import colors from '../../assets/colors/AppColors';
import fonts from '../../assets/fonts/MyFonts';
import { Icons } from '../../assets/icons/Icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AppHeader = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Image
                    source={MyImages.logo_trans}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title} ellipsizeMode="tail">
                    Markazi Jamia Ghausia Masjid <Text style={{ textAlign: 'center', fontSize: 12, fontFamily: fonts.semibold,color:"#151515" }}>& Ghausia Madrassa</Text>
                </Text>
            </View>
            <Pressable onPress={() => navigation.openDrawer()} style={styles.iconContainer}>
                <Icons.Ionicons name="menu" size={22} color={colors.black} />
            </Pressable>
        </View>
    );
};

export default AppHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 10,
        height: 55,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor:'blue',
        flex: 1,
    },
    logo: {
        height: 80,
        width: 80,
    },
    title: {
        fontSize: 16,
        color: colors.black,
        fontFamily: fonts.semibold,
        marginLeft: -5,
        marginRight: 5,
        textAlign: 'left',
        // backgroundColor:'red',
        flex: 1


    },
    iconContainer: {
        // flex:1,
        marginRight: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
});
