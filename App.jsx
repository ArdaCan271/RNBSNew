import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/AntDesign';
import { store } from './src/store/store';
import { Provider } from 'react-redux'

import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import DetailScreen from './src/screens/DetailScreen';
import PermissionScreen from './src/screens/PermissionScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Scan'>
          <Stack.Screen
            name='Scan'
            component={ScanScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Detail'
            component={DetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Permission'
            component={PermissionScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({

});

export default App;