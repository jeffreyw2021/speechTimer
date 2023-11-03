// Third Party Imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, TextInput, Alert } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import axios from 'axios';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Local Imports
import colors from '../styles/colors';
import styles from '../styles/styles';
import NavBar from '../components/navBar';
import LoginModal from '../components/loginModal';
//Firebse imports
import * as firebaseComponents from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const firebaseConfig = {
    apiKey: firebaseComponents.apiKey,
    authDomain: firebaseComponents.authDomain,
    projectId: firebaseComponents.projectId,
    storageBucket: firebaseComponents.storageBucket,
    messagingSenderId: firebaseComponents.messagingSenderId,
    appId: firebaseComponents.appId,
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function Home(props) {

    //========== Account ==========//
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserUID, setCurrentUserUID] = useState("");
    const [isLoginModalVisible, setLoginModalVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        // Function to check user credentials in AsyncStorage
        const checkStoredCredentials = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                console.log("Stored email:", storedEmail);
                const storedPassword = await AsyncStorage.getItem("password");
                console.log("Stored password:", storedPassword);

                if (storedEmail && storedPassword) {
                    setEmail(storedEmail);
                    setPassword(storedPassword);
                    // Use these credentials to log the user in
                    autoLogin(storedEmail, storedPassword);
                }
            } catch (error) {
                console.error("Error reading AsyncStorage:", error);
            }
        };
        checkStoredCredentials();
    }, []);
    const autoLogin = async (emailToLogin, passwordToLogin) => {
        try {
            console.log("Attempting login with:", emailToLogin, passwordToLogin);
            // Authenticate user with Firebase
            await firebase
                .auth()
                .signInWithEmailAndPassword(emailToLogin, passwordToLogin);
            if (firebase.auth().currentUser.emailVerified === false) {
                Alert.alert("Error", "Please verify your email.");
                await firebase.auth().signOut();
                return;
            }
            console.log("User auto-logged in successfully with Firebase.");
            setIsLoggedIn(true);
            setCurrentUserUID(firebase.auth().currentUser.uid);
            setLoginModalVisible(false);

            // Store email and password in AsyncStorage
            await AsyncStorage.setItem("email", emailToLogin);
            await AsyncStorage.setItem("password", passwordToLogin);

            const userId = firebase.auth().currentUser.uid;
            await ensureUserDocumentExists(userId);

            console.log(
                "is user verified:" + firebase.auth().currentUser.emailVerified
            );
        } catch (error) {
            console.error("Login failed:", error);
            Alert.alert(
                "Error",
                "An error occurred during auto-login. Please try again."
            );
        }
    };
    const ensureUserDocumentExists = async (userId) => {
        const db = firebase.firestore();

        // Get a reference to the user's document
        const userDocRef = db.collection('users').doc(userId);

        // Check if the document exists
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            // If the document doesn't exist, create it
            await userDocRef.set({
                email: firebase.auth().currentUser.email,
                markers: [],
                uid: userId
            });
            console.log(`Created a new document for user: ${userId}`);
        }
    };

    return (
        <View style={styles.container}>
            
        </View>
    );
}

export default Home;