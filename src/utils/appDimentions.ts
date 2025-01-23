import { Dimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get('window');
const deviceWidth = width;
const deviceHeight = height;

const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV
    ? (width >= X_WIDTH && height >= X_HEIGHT) ||
    (width >= XSMAX_WIDTH && height >= XSMAX_HEIGHT)
    : false;

const useInsets = () => {
  const insets = useSafeAreaInsets()
  return {
    statusBar: Platform.select({
      ios: insets.top,
      android: StatusBar.currentHeight,
    }),
    top: insets.top,
    bottom: insets.bottom,
    paddingBottom: insets.bottom + 30,
  }
}

const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

const isSmallDevice = height < X_HEIGHT
const BOTTOM_TAB_BAR_HEIGHT = Platform.OS === "android" ? 75 : 55
const BOTTOM_TAB_BAR_PADDING = Platform.OS === "android" ? 15 : 5

const calculateImageHeight = (imageWidth: number, imageHeight: number) => {
  let calculatedWidth = imageWidth;
  let calculatedHeight = imageHeight;

  if (imageWidth >= imageHeight) {
    let answer = imageWidth / width;
    calculatedWidth = width;
    calculatedHeight = calculatedHeight / answer;
    if (calculatedHeight < 180) return 160
    else return 220;
  } else return 220;
};

export {
  deviceWidth,
  deviceHeight,
  StatusBarHeight,
  isSmallDevice,
  BOTTOM_TAB_BAR_HEIGHT,
  BOTTOM_TAB_BAR_PADDING,
  calculateImageHeight,
  isIPhoneX,
  useInsets,
}