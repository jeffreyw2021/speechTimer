import { StyleSheet, Dimensions } from 'react-native';
import colors from '../styles/colors';

const styles = StyleSheet.create({
    navBar: {
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: '14%',
        paddingBottom: 40,
        paddingTop: 10,
        position: 'absolute',
        bottom: 0,
    },
    navBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50
    },
    navButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    defaultNavButton: {
        color: colors.lightGreyColor,
    },
    activeNavButton: {
        color: colors.mainColor,
    },
    navText: {
        color: colors.mainColor,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.lightGreyColor,
        width: 70,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff60',
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0.5,
        elevation: 4,
    },
    clickedButton: {
        backgroundColor: colors.mainColor,
        width: 70,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff60',
        marginTop: 10,
    },
    plusText: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 40,
    },

    addModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      addModalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%', // Sets the modal width to 90% of the screen width
        height: '90%', // Sets the modal height to 90% of the screen height
      },
      addModalText: {
        marginBottom: 15,
        textAlign: "center",
        // ... other styling for text
      },
      addModalButtonClose: {
        // ... styling for the close button
      },
      addModalButtonText: {
        // ... styling for the close button text
      }
});

export default styles;