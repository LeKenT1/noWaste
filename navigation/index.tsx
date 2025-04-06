import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from '../app/index';
import ListScreen from '../app/list';
import CameraScreen from '../app/camera';
import FoodNameScreen from '../app/food-name';
import DateScreen from '../app/date';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' },
            gestureEnabled: false
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="FoodName" component={FoodNameScreen} />
          <Stack.Screen name="Date" component={DateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 