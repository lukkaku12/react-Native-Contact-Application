import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInRegisterView from '../screens/LogInRegisterView'; 
import { RootStackParamList } from '../types/navigation.types'; 

const Stack = createNativeStackNavigator<RootStackParamList>();

const PublicStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RegisterLogin"
      component={LogInRegisterView}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default PublicStackNavigator;