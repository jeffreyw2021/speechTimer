// Third Party Imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Button, Text, TextInput, Alert, TouchableOpacity, Image, ImageBackground, Animated, ScrollView } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// Local Imports
import colors from '../styles/colors';
import styles from '../styles/styles';
import detailStyles from '../styles/detailStyles';
import NavBar from '../components/navBar';
//Firebse imports
import * as firebaseComponents from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { faCaretDown, faCaretUp, faLocationDot } from '@fortawesome/free-solid-svg-icons';

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

function Detail(props) {
    const [verticalLines, setVerticalLines] = useState([25, 50, 75]);
    const scrollRef = useRef();
    const [scrollX, setScrollX] = useState(0);
    const screenWidth = Dimensions.get('window').width;
    const [centeredLine, setCenteredLine] = useState(null);
    const lineLength = 1000;
    const [isCentered, setIsCentered] = useState(false);

    const handleScroll = (event) => {
        setScrollX(event.nativeEvent.contentOffset.x);

        const newCenteredLine = verticalLines.find((percent) => isCenter(percent));
        if (newCenteredLine !== undefined && newCenteredLine !== centeredLine) {
            setCenteredLine(newCenteredLine);
            scrollRef.current.setNativeProps({ scrollEnabled: false });
            setTimeout(() => {
                scrollRef.current.setNativeProps({ scrollEnabled: true });
            }, 100);
            setIsCentered(true);
        } else if (newCenteredLine === undefined && centeredLine !== null) {
            setCenteredLine(null);
            setIsCentered(false);
        }
    };

    const isCenter = (percent) => {
        const linePosition = (percent / 100) * (lineLength);
        return Math.abs((linePosition + 35) - (scrollX + screenWidth / 2)) < 8;
    };

    return (
        <View style={[styles.container]}>
            <View style={detailStyles.topContainer}>
                <View style={detailStyles.topBlock}>
                    {isCentered && (
                        <Text style={detailStyles.topBlockText}>Break Point 1</Text>
                    )}
                </View>
                <ScrollView
                    ref={scrollRef}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={detailStyles.scrollContainer}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <View style={detailStyles.lineContainer}>
                        <View style={detailStyles.circle} />
                        <View style={[detailStyles.line, { width: lineLength }]}>
                            {[...Array(99)].map((_, i) => (
                                <View
                                    key={i + 1}
                                    style={[
                                        detailStyles.secondLine,
                                        { left: (i + 1) * 10 },
                                    ]}
                                />
                            ))}
                            {verticalLines.map((percent, index) => (
                                <View
                                    key={index}
                                    style={[
                                        detailStyles.verticalLineContainer,
                                        { left: `${percent}%` },
                                        isCenter(percent) ? { transform: [{ translateY: -34 }] } : { transform: [{ translateY: -15 }] }
                                    ]}
                                >
                                    {isCenter(percent) && (
                                        <FontAwesomeIcon icon={faCaretDown} size={20} color={"red"} />
                                    )}
                                    <View style={[detailStyles.verticalLine, isCenter(percent) ? { height: 84 } : {}]} />
                                </View>
                            ))}
                        </View>
                        <View style={detailStyles.circle} />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}



export default Detail;