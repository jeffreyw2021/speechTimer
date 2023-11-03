// Third Party Imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Button, Text, TextInput, Alert, TouchableOpacity, Image, ImageBackground, Animated } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Local Imports
import colors from '../styles/colors';
import styles from '../styles/styles';
import NavBar from '../components/navBar';
import accountStyles from '../styles/accountStyles';
//Firebse imports
import * as firebaseComponents from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const usersCollection = firebase.firestore().collection('users');

function Setting(props) {

    //========== Account ==========//

    const [uid, setUid] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get current logged-in user
                const currentUser = firebase.auth().currentUser;

                // Log the current user's details
                console.log("Current user:", currentUser.uid);
                const userDoc = await usersCollection.doc(currentUser.uid).get();

                if (currentUser && currentUser.uid) {
                    // Fetch the user's document from Firestore based on UID

                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        console.log("User data from Firestore:", userData);

                        if (userData && userData.uid) {
                            setUid(userData.uid);
                        }
                        if (userData && userData.email) {
                            setEmail(userData.email);
                        }
                    } else {
                        console.error('User document not found in Firestore.');
                    }
                } else {
                    console.error('No user is currently logged in.');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                console.error("Logged in user's UID:", firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'No user logged in');
            }
        };

        fetchUserData();
    }, []);

    //========= Logout =========//
    const logoutAndClearCredentials = async () => {
        try {
            // Clear credentials from AsyncStorage
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
            console.log('Cleared stored email and password.');

            // Log the user out from Firebase
            await firebase.auth().signOut();

            // After logging out, navigate to the 'Home' screen with correct capitalization
            props.navigation.replace('Home'); // This prevents going back to the Setting screen after logout
        } catch (error) {
            console.error('Error during logout and clearing AsyncStorage:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={accountStyles.settingContainer}>
                <View style={accountStyles.userInfoContainer}>
                    <View style={accountStyles.userLeft}>
                        {email && (
                            <View style={accountStyles.nameContainer}>
                                <Text style={accountStyles.nameText} numberOfLines={1}>
                                    {email}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                <TouchableOpacity style={accountStyles.logoutButton} onPress={logoutAndClearCredentials}>
                    <Text style={accountStyles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

export default Setting;