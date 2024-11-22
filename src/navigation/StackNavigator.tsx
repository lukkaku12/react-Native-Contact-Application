import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation.types';
import HomeScreen from '../screens/HomeScreen';
import ContactScreen from '../screens/ContactScreen';
import CreateContact from '../screens/CreateContact';
import MapsScreen from '../screens/MapsScreen';
import PublicStackNavigator from './PublicStackNavigator';
import CustomHeader from '../components/CustomHeader';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Details"
        component={ContactScreen}
        options={{header: () => <CustomHeader title="Details" />}}
      />
      <Stack.Screen
        name="newContact"
        component={CreateContact}
        options={{header: () => <CustomHeader title="Create Contact" />}}
      />
      <Stack.Screen
        name="mapOptions"
        component={MapsScreen}
        options={{header: () => <CustomHeader title="Maps" />}}
      />
      <Stack.Screen
        name="LoginStack"
        component={PublicStackNavigator}
        options={{headerShown: false}} // LoginStack no tiene BottomTab
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
