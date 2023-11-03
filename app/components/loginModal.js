// LoginModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, TextInput, Alert, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/loginModalStyle';
//Firebse imports
import * as firebaseComponents from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
//local imports
import colors from '../styles/colors';

const LoginModal = ({ isLoginModalVisible, setLoginModalVisible }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserUID, setCurrentUserUID] = useState("");
    const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
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
                timers: [],
                uid: userId
            });
            console.log(`Created a new document for user: ${userId}`);
        }
    };
    const handleLogin = async () => {
        try {
            console.log("Sending email:", email, "Password:", password); // Logging the email and password
            // Authenticate user with Firebase
            await firebase.auth().signInWithEmailAndPassword(email, password);
            if (firebase.auth().currentUser.emailVerified === false) {
                Alert.alert("Error", "Please verify your email.");
                await firebase.auth().signOut();
                return;
            }
            console.log("User logged in successfully with Firebase.");
            setIsLoggedIn(true);
            setCurrentUserUID(firebase.auth().currentUser.uid);
            setLoginModalVisible(false);

            // Store email and password in AsyncStorage
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("password", password);

            const userId = firebase.auth().currentUser.uid;
            await ensureUserDocumentExists(userId);

        } catch (error) {
            // console.error('Login failed:', error);
            Alert.alert(
                "Error",
                "Your entries of email or password may be incorrect. Please try again."
            );
        }
    };
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
    const handleActualRegistration = async () => {
        // Email validation
        if (!email) {
            Alert.alert("Error", "Email cannot be empty!");
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address!");
            return;
        }
        // Password validation
        if (!password) {
            Alert.alert("Error", "Password cannot be empty!");
            return;
        }
        const MIN_PASSWORD_LENGTH = 6;
        if (password.length < MIN_PASSWORD_LENGTH) {
            Alert.alert(
                "Error",
                `Password should be at least ${MIN_PASSWORD_LENGTH} characters long!`
            );
            return;
        }

        try {
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                await currentUser.updatePassword(password);
                console.log("Password updated successfully for", email);

                setIsTemporarilyLoggedIn(false);
                setIsLoggedIn(true); // Update the login status
                setCurrentUserUID(currentUser.uid);
                setLoginModalVisible(false);
                setIsRegisterMode(false);

                // Store email and password in AsyncStorage
                await AsyncStorage.setItem("email", email);
                await AsyncStorage.setItem("password", password);

                const userId = firebase.auth().currentUser.uid;
                await ensureUserDocumentExists(userId);
            } else {
                Alert.alert("Error", "User not authenticated. Cannot update password.");
            }
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                    "Error",
                    "Please re-login and try again. For security reasons, password updates require a recent login."
                );
                // You might want to sign the user out here and prompt them to log in again.
            } else {
                console.error("Password update failed:", error);
                Alert.alert(
                    "Error",
                    "An error occurred during password update. Please try again."
                );
            }
        }
    };

    //method to await sendEmailVerification(userCred.user);
    const sendVerification = async (user) => {
        await sendEmailVerification(user);
        console.log("Verification email sent.");
    };
    //const to store usercred
    const [globalUserCred, setGlobalUserCred] = useState(null);
    const [verificationSent, setVerificationSent] = useState(false);
    const [isTemporarilyLoggedIn, setIsTemporarilyLoggedIn] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const startVerificationCountdown = () => {
        setButtonDisabled(true);
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    setButtonDisabled(false);
                    return 60; // reset countdown
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };
    useEffect(() => {
        return () => {
            setCountdown(60);
        };
    }, []);
    // Generate a temporary password (simple version, consider using a more complex method)
    const generateTempPassword = () => {
        return Math.random().toString(36).slice(-8);
    };
    // Handle temporary registration
    const handleTemporaryRegistration = async () => {
        const tempPassword = generateTempPassword();
        try {
            const userCred = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, tempPassword);
            setGlobalUserCred(userCred);
            console.log("User registered temporarily with Firebase.");

            setIsTemporarilyLoggedIn(true); // Set the temporary login status
            sendVerification(userCred.user); // Send verification mail
        } catch (error) {
            console.error("Temporary registration failed:", error);
            Alert.alert(
                "Error",
                "An error occurred during temporary registration. Please try again."
            );
        }
    };
    // Check if the user is verified
    useEffect(() => {
        if (isTemporarilyLoggedIn) {
            const interval = setInterval(async () => {
                const user = firebase.auth().currentUser;
                await user.reload();
                if (user.emailVerified) {
                    console.log("is user verified " + user.emailVerified);
                    setIsRegisterMode(true); // Switch to setting permanent password mode
                    setIsVerified(true);
                    clearInterval(interval);
                }
            }, 2000); // Check every 2 seconds

            return () => clearInterval(interval); // Clear the interval when component is unmounted or if condition changes
        }
    }, [isTemporarilyLoggedIn]);

    const [isInputFocused, setIsInputFocused] = useState(false);
    const screenHeight = Dimensions.get('window').height;

    // Initialize translateY with off-screen value
    const [translateY] = useState(new Animated.Value(screenHeight));
    useEffect(() => {
        if (isLoginModalVisible) {
            // Animate in
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        } else {
            // Animate out
            Animated.timing(translateY, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    }, [isLoginModalVisible, translateY]);
    // Set up a style for the animated component
    const modalStyle = [
        styles.modal,
        {
            transform: [{
                translateY: translateY.interpolate({
                    inputRange: [0, screenHeight],
                    outputRange: [0, screenHeight],
                    extrapolate: 'clamp',
                })
            }],
        },
    ];

    return (
        <Animated.View style={modalStyle}>
            <View style={[styles.loginModal, { height: isInputFocused ? screenHeight * 0.9 : screenHeight * 0.6 }]}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                        if (isTemporarilyLoggedIn) {
                            const currentUser = firebase.auth().currentUser;
                            currentUser
                                .delete()
                                .then(() => {
                                    console.log("Temporarily created user deleted.");
                                })
                                .catch((error) => {
                                    console.error(
                                        "Error deleting temporarily created user:",
                                        error
                                    );
                                });
                        }
                        setLoginModalVisible(false);
                        setIsRegisterMode(false);
                        setIsTemporarilyLoggedIn(false);
                    }}
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        size={25}
                        style={styles.cancelIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.loginTitle}>
                    {isRegisterMode ? 'Register' : 'Login'}
                </Text>
                <View style={styles.inputContainer}>
                    <View style={styles.numberContainer}>
                        <Text style={styles.loginText}>Email</Text>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.loginInput}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoCompleteType="email"
                            keyboardType="email-address"
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                        />
                        {isRegisterMode && !verificationSent ? (
                            <View style={styles.verifyButtonContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.sendVerificationButton,
                                        isVerified ? { backgroundColor: '#d9f99d' } : {},
                                    ]}
                                    onPress={() => {
                                        handleTemporaryRegistration();
                                        if (!isButtonDisabled) {
                                            sendVerification();
                                            startVerificationCountdown();
                                        }
                                    }}
                                    disabled={isButtonDisabled}
                                >
                                    <Text
                                        style={[
                                            styles.sendVerificationButtonText,
                                            isButtonDisabled
                                                ? { color: colors.lightMainColor }
                                                : {},
                                            isVerified ? { color: '#65a30d' } : {},
                                        ]}
                                    >
                                        {isVerified
                                            ? '☑ verified'
                                            : countdown !== 60
                                                ? `${countdown}s`
                                                : 'send verification'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                    {!isRegisterMode ? (
                        <View style={styles.numberContainer}>
                            <Text style={styles.loginText}>Password</Text>
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.loginInput}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                            />
                        </View>
                    ) : null}
                    {isVerified ? (
                        <View style={styles.numberContainer}>
                            <Text style={styles.loginText}>Set Your Password</Text>
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.loginInput}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                            />
                        </View>
                    ) : null}
                </View>
                {isVerified ? (
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleActualRegistration}
                    >
                        <Text style={styles.loginButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                ) : !isRegisterMode ? (
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                ) : null}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>
                        {isRegisterMode
                            ? 'Already have an account?'
                            : "Don't have an account?"}
                    </Text>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => {
                            setIsRegisterMode(!isRegisterMode);
                            setEmail('');
                            setPassword('');
                        }}
                    >
                        <Text style={styles.registerButtonText}>
                            {isRegisterMode ? 'Login' : 'Sign up'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

export default LoginModal;
