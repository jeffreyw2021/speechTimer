import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const detailStyles = StyleSheet.create({
    topContainer: {
        width: '100%',
        height: '100%',
    },
    topBlock: {
        height: 260, 
        width: '100%', 
        position: 'absolute', 
        top: 0, 
        backgroundColor: colors.whiteColor,
        paddingTop: 80
    },
    topBlockText: {
        fontSize: 16, 
        fontWeight: 'bold', 
        color: colors.mainColor, 
        textAlign: 'center', 
        marginTop: 20
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: '100%',
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingHorizontal: 20,
        marginTop: 120,
        height: 140,
        backgroundColor: colors.whiteColor,
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: colors.mainColor,
    },
    line: {
        height: 2,
        backgroundColor: colors.mainColor,
        overflow: 'visible'
    },
    verticalLineContainer: {
        position: 'absolute',
        top: '50%',
        width: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verticalLine: {
        top: 0,
        width: 2,
        height: 30,
        backgroundColor: 'red',
    },
    secondLine: {
        position: 'absolute',
        top: 0,
        width: 1,
        height: 8,
        backgroundColor: colors.mainColor,
        transform: [{ translateY: -3 }]
    },

});


export default detailStyles;