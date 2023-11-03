//eas submit -p ios --latest
import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, Plateform } from 'react-native';
// import Home from './app/screens/home';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/components/AppNavigator';
// import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';

export default function App() {
  return (
    <AppNavigator />
  );
}
