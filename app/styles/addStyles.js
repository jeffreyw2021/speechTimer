import { StyleSheet, Dimensions } from 'react-native';
import colors from '../styles/colors';

const addStyles = StyleSheet.create({
  addViewContainer: {
    position: 'absolute',
    backgroundColor: colors.smokeWhiteColor,
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height * 0.9),
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowOpacity: 0.1,
  },
  closeButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 10,
  },
  timeInputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginVertical: 20,
    rowGap: 10,
  },
  timeInputCollection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    paddingRight: 7,
    height: 50,
  },
  timeTextInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    fontSize: 16,
    color: colors.lightMainColor,
  },
  timeInput: {
    padding: 10,
    marginHorizontal: 5,
    minWidth: 50,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  timeConfirmButton: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: colors.blueColor,
    alignItems: 'center',
  },
  timeConfirmButtonText: {
    color: colors.whiteColor,
    fontSize: 16,
  },

  speechInputContainer: {
    width: '100%',
    minHeight: 100,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    rowGap: 10,
  },
  speechInputCollection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    rowGap: 10,
  },
  speechEndPoint: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBreakPoint: {
    padding: 0,
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  addSpeechBreakPoint: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    fontSize: 18,
    color: colors.lightMainColor,
    justifyContent: 'center',
    alignItem: 'center',
    textAlign: 'center',
  },
  breakpointDisplay: {
    fontSize: 18,
    color: colors.lightMainColor,
    justifyContent: 'center',
    alignItem: 'center',
    backgroundColor: colors.whiteColor,
    height: 50
  },
  breakpointDisplayText: {
    fontSize: 18,
    justifyContent: 'center',
    alignItem: 'center',
    alignSelf: 'center',
    color: colors.lightMainColor,
  },
  breakpointTimeInput: {
    padding: 10,
    marginHorizontal: 5,
    minWidth: 30,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  swipeable:{
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    width: '100%',
    height: 50,
    padding: 0,
    marginRight: -10
  },
  swipeableRight:{
    marginTop: -25,
    height: 50, 
    paddingLeft: 12,
    backgroundColor: colors.redColor, 
    justifyContent: 'center',
    alignItems: 'flex-start',
  }
});

export default addStyles;