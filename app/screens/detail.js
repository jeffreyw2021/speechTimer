// Third Party Imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Button, Text, TextInput, Alert, TouchableOpacity, Image, ImageBackground, Animated } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// Local Imports
import colors from '../styles/colors';
import styles from '../styles/styles';
import NavBar from '../components/navBar';
//Firebse imports
import * as firebaseComponents from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

function Detail(props) {
    return (
        <View style={styles.container}>

        
        </View>
    );
}

export default Detail;