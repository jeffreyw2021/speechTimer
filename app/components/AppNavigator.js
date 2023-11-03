// AppNavigator.js
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
//screens import
import Home from "../screens/home";
import Setting from "../screens/setting";
import Detail from "../screens/detail";
//components import
import NavBar from './navBar';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
        <NavBar />
      </View>
    </NavigationContainer>
  );
};

export default AppNavigator;
