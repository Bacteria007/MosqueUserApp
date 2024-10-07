import {StyleSheet} from 'react-native';
import colors from '../colors/AppColors';
import fonts from '../fonts/MyFonts';

const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_clr,
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
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.white,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  authBottomConatiner: {
    flex: 1,
    paddingHorizontal: 16,
    width: '100%',
  },
  errorText: {color: 'red', marginBottom: 10, marginLeft: 5},
});

export default CommonStyles;
