import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faBarsStaggered, faUser } from '@fortawesome/free-solid-svg-icons';
import navBarStyles from '../styles/navBarStyles';
//Firebse imports
import * as firebaseComponents from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
//local imports
import LoginModal from '../components/loginModal';
import AddView from '../components/addModal';

function NavBar() {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isAddViewVisible, setAddViewVisible] = useState(true);
  const navigation = useNavigation();
  const state = useNavigationState(state => state);

  // Assume 'Add' is the default active route if the state is not yet available
  const activeRouteName = state ? state.routes[state.index].name : 'Home';

  const handlePress = () => {
    if (activeRouteName === 'Home') {
      setAddViewVisible(!isAddViewVisible);
    } else {
      navigation.navigate('Home');
      setAddViewVisible(!isAddViewVisible);
    }
  };

  const handleHomeClick = () => {
    navigation.navigate('Home');
  };

  const handleSettingClick = () => {
    const user = firebase.auth().currentUser;
    if (!user) {
      setLoginModalVisible(true);
    } else {
      navigation.navigate('Setting');
    }
  }

  return (
    <View style={[navBarStyles.navBar]}>
      <View style={navBarStyles.navBarContainer}>
        <TouchableOpacity
          style={[navBarStyles.navButton]}
          onPress={handleHomeClick}
        >
          <FontAwesomeIcon
            icon={activeRouteName === 'Home' ? faBarsStaggered : faBars}
            size={26}
            style={[
              navBarStyles.defaultNavButton,
              activeRouteName === 'Home' && navBarStyles.activeNavButton,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePress}
          style={navBarStyles.button}
        >
          <Text style={navBarStyles.plusText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navBarStyles.navButton}
          onPress={handleSettingClick}
        >
          <FontAwesomeIcon
            icon={faUser}
            size={26}
            style={[
              navBarStyles.defaultNavButton,
              activeRouteName === 'Setting' && navBarStyles.activeNavButton,
            ]}
          />
        </TouchableOpacity>
      </View>

      {isLoginModalVisible && (
        <LoginModal
          isLoginModalVisible={isLoginModalVisible}
          setLoginModalVisible={setLoginModalVisible}
        />
      )}

      {/* Modal for Add view */}
      <AddView
        isVisible={isAddViewVisible}
        onClose={() => setAddViewVisible(false)}
      />
    </View>

  );
}

export default NavBar;
