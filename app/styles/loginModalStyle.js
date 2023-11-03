import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const screenWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const loginModalStyles = StyleSheet.create({
    loginModal: {
        position: 'absolute',
        width: screenWidth,
        height: '60%',
        margin: 0,
        bottom: -25,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        backgroundColor: colors.whiteColor,
        padding: 20,
        paddingTop: 40,
        shadowOpacity: 0.2,
    },
    registerModal: {
        position: 'absolute',
        width: screenWidth,
        height: '60%',
        margin: 0,
        bottom: -25,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        backgroundColor: colors.whiteColor,
        padding: 20,
        paddingTop: 40,
        shadowOpacity: 0.2,
        zIndex: 9999
    },
    inputContainer: {
        width: '100%',
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10,
        marginBottom: 10,
    },
    numberContainer: {
        width: '100%',
        flex: 0.5,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    loginText: {
        width: '100%',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 5
    },
    loginInput: {
        width: '100%',
        height: 55,
        backgroundColor: colors.whiteColor,
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        borderColor: colors.lightGreyColor,
        borderWidth: 1,
        color: colors.blackColor
    },
    loginTitle: {
        width: '100%',
        fontSize: 30,
        fontWeight: '600',
        marginBottom: 20
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 25,
    },
    loginButtonText: {
        color: colors.whiteColor,
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        position: 'absolute',
        right: 20,
        top: 20
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20,
        width: '100%',
        paddingLeft: 20,
    },
    registerText: {
        marginRight: 5,
        fontSize: 16,
    },
    registerButtonText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    verifyButtonContainer: {
        position: 'absolute',
        height: 55,
        right: 10,
        bottom: 0,
        justifyContent: 'center',
    },
    sendVerificationButton: {
        backgroundColor: colors.smokeWhiteColor,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    sendVerificationButtonText: {
        color: colors.blackColor,
        fontSize: 18,
        fontWeight: '400',
    },
});


export default loginModalStyles;