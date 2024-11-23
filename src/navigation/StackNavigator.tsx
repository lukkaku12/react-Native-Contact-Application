import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import ContactScreen from '../screens/ContactScreen';
import CreateContact from '../screens/CreateContact';
import MapsScreen from '../screens/MapsScreen';
import CustomHeader from '../components/CustomHeader';
import OnBoarding from '../components/OnBoarding';
import LogInRegisterView from '../screens/LogInRegisterView';
import ContactPage from '../screens/ContactPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#f4f4f8',
      tabBarInactiveTintColor: '#333',
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Config"
      component={ContactPage}
      options={{
        headerShown: false,
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export const StackNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="OnBoarding">
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={ContactScreen}
        options={{ header: () => <CustomHeader title="Details" /> }}
      />
      <Stack.Screen
        name="NewContact"
        component={CreateContact}
        options={{ header: () => <CustomHeader title="Create Contact" /> }}
      />
      <Stack.Screen
        name="MapOptions"
        component={MapsScreen}
        options={{ header: () => <CustomHeader title="Maps" /> }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnBoarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterLogin"
        component={LogInRegisterView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default StackNavigator;
