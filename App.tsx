import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PublicStackNavigator from './src/navigation/PublicStackNavigator'; // Solo este archivo maneja el flujo de login
import OnBoarding from './src/components/OnBoarding';
import { RootStackParamList } from './src/types/navigation.types';
import HomeScreen from './src/screens/HomeScreen';
import ContactPage from './src/screens/ContactPage';

// Aquí creamos un TabNavigator que se usará solo después del login.
const Tab = createBottomTabNavigator<RootStackParamList>();

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
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name="config"
      component={ContactPage}
      options={{
        headerShown: false,
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />,
      }}
      initialParams={{
        item: { id: 12312, name: 'John', last_name: 'Doe', phone_number: '123-456-7890', picture_uri: 'dsfs' },
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [onBoardingComplete, setOnboardingComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkOnboardingAndAuth = async () => {
      const onboardingStatus = await AsyncStorage.getItem('onBoardingComplete');
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      
      setOnboardingComplete(onboardingStatus === 'true');
      setIsLoggedIn(loginStatus === 'true');
    };
    
    checkOnboardingAndAuth();
  }, []);

  const handleOnBoardingComplete = async () => {
    await AsyncStorage.setItem('onBoardingComplete', 'true');
    setOnboardingComplete(true);
  };

  return (
    <NavigationContainer >
      {onBoardingComplete ? (
        isLoggedIn ? <TabNavigator /> : <PublicStackNavigator />
      ) : (
        <OnBoarding onComplete={handleOnBoardingComplete} />
      )}
    </NavigationContainer>
  );
};

export const styles = StyleSheet.create({
  icon: { position: 'absolute', left: 10, padding: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Poppins-Bold' },
});

export default App;