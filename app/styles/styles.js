import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const screenWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '80%', // Set the modal height
        backgroundColor: 'white', // Set the modal background color
        // Add other styles as needed
      },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    backdropTouch: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        height: windowHeight * 0.85,
        width: '100%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    segmentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        paddingHorizontal: 16
    },
    segmentControl: {
        width: '100%',
        height: 40,
    },
    contentContainer: {
        paddingHorizontal: 16,
        width: '100%',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: colors.lightGreyColor,
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        width: '100%',
      },
      button: {
        backgroundColor: colors.mainColor,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
      },
      
});


export default styles;