import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Feather';
import Onboarding from 'react-native-onboarding-swiper';

import ContactPage from './src/screens/ContactPage';
import HomeScreen from './src/screens/HomeScreen';
import ContactScreen from './src/screens/ContactScreen';
import CreateContact from './src/screens/CreateContact';
import MapsScreen from './src/screens/MapsScreen';

export type RootStackParamList = {
  Home: undefined;
  HomeTab: undefined;
  Details: { item: { id: number; name: string; last_name: string; phone_number: string; picture_uri: string} };
  mapOptions: { item: { id: number; name: string; last_name: string; phone_number: string; picture_uri: string} };
  newContact: undefined;
  config: {
    item: {
      id: number; name: string; last_name: string; phone_number: string; picture_uri: string
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const CustomHeader = ({ title }: { title: string }) => {
  const navigation = useNavigation<any>();
  const opacity = useSharedValue(1);

  const handleGoBack = () => navigation.goBack();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: withTiming(opacity.value, { duration: 500 }) }],
  }));

  return (
    <Animated.View style={[styles.headerContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={() => {
          opacity.value = withTiming(0, { duration: 200 }, () => {
            opacity.value = 1;
            runOnJS(handleGoBack)();
          });
        }}
        style={styles.icon}
        hitSlop={30}
      >
        <Entypo name="arrow-left" color="black" size={30} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </Animated.View>
  );
};

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Details" component={ContactScreen} options={{ header: () => <CustomHeader title="Details" /> }} />
    <Stack.Screen name="newContact" component={CreateContact} options={{ header: () => <CustomHeader title="Create Contact" /> }} />
    <Stack.Screen name="mapOptions" component={MapsScreen} options={{ header: () => <CustomHeader title="Maps" /> }} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#f4f4f8',
      tabBarInactiveTintColor: '#333',
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={StackNavigator}
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

const onboardingStyles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', fontFamily: 'Poppins-Bold' },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#666', fontFamily: 'Poppins-SemiBold' },
});

const OnBoarding = ({ onComplete }: { onComplete: () => void }) => (
  <Onboarding
    onDone={onComplete}
    onSkip={onComplete}
    pages={[
      {
        backgroundColor: '#fff',
        image: <AntDesign name="contacts" size={100} color="#333" />,
        title: <Text style={onboardingStyles.title}>Crea Contactos</Text>,
        subtitle: <Text style={onboardingStyles.subtitle}>Guarda y organiza a tus contactos fácilmente.</Text>,
      },
      {
        backgroundColor: '#4A90E2',
        image: <AntDesign name="edit" size={100} color="#fff" />,
        title: <Text style={onboardingStyles.title}>Edita y Actualiza</Text>,
        subtitle: <Text style={onboardingStyles.subtitle}>Actualiza detalles de contactos cuando lo necesites.</Text>,
      },
      {
        backgroundColor: '#8DC9FF',
        image: <AntDesign name="enviromento" size={100} color="#fff" />,
        title: <Text style={onboardingStyles.title}>Ubicación y Clima</Text>,
        subtitle: <Text style={onboardingStyles.subtitle}>Agrega ubicación y consulta el clima actual.</Text>,
      },
    ]}
  />
);

const App = () => {
  const [onBoardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem('onBoardingComplete');
      setOnboardingComplete(completed === 'true');
    };

    checkOnboarding();
  }, []);

  const handleOnBoardingComplete = async () => {
    await AsyncStorage.setItem('onBoardingComplete', 'true');
    setOnboardingComplete(true);
  };

  return (
    <NavigationContainer>
      {onBoardingComplete ? <TabNavigator /> : <OnBoarding onComplete={handleOnBoardingComplete} />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#4A90E2',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  icon: { position: 'absolute', left: 10, padding: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Poppins-Bold' },
});

export default App;