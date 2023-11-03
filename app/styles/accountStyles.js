import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const accountStyles = StyleSheet.create({
    settingContainer: {
        paddingTop: 80,
        paddingHorizontal: 20,
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        position:"absolute",
        bottom:130,
        height:60,
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor: '#000',
        borderRadius:12,
    },
    logoutButtonText:{
        color: '#fff',
        fontSize: 18,
    },
    userInfoContainer: {
        width: '100%',
        minHeight: 100,
        padding: 20,
        paddingRight: 30,
        backgroundColor: colors.whiteColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
    },
    userLeft: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        columnGap: 20,
        paddingRight: 20,
    },
    nameContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        rowGap: 5,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.mainColor,
    },
});
export default accountStyles;