import {StatusBar, StyleSheet} from 'react-native';
import colors from '../colors/AppColors';
import fonts from '../fonts/MyFonts';

const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContentContainer: {
    flex: 1,
    backgroundColor: colors.bg_clr,
    justifyContent: 'center',
    padding: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPadding: {
    padding: 20,
  },
  centerWhiteContainer: {
    flex: 1,
    backgroundColor: colors.bg_clr,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authImage: {
    width: '100%',
    height: '50%',
    objectFit: 'cover',
  },
  authTitle: {
    fontSize: 22,
    fontFamily: fonts.semibold,
    color: colors.white,
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 14,
    letterSpacing: 2,
  },
  authSubtitle: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'left',
    letterSpacing: 4,
    marginLeft: 14,
  },
  authHeader: {
    height: 140,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    width: '100%',
    justifyContent: 'flex-start',
  },
  authBottomConatiner: {
    marginTop: 30,
    paddingHorizontal: 16,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  authFooter: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    paddingVertical: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
    // marginTop: 200,
    flex: 1,
  },
  errorText: {color: 'red', marginBottom: 10, marginLeft: 5},
});

export default CommonStyles;
