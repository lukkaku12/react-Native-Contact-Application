import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  StyleSheet,
  StatusBar,
} from 'react-native';
import ContactPage from './src/screens/ContactPage';
import HomeScreen from './src/screens/HomeScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContactScreen from './src/screens/ContactScreen';
import CreateContact from './src/screens/CreateContact';
import MapsScreen from './src/screens/MapsScreen';
// Definir el tipo del Stack
export type RootStackParamList = {
  Home: undefined;
  HomeTab: undefined;
  Details: {item: {id: string; firstName: string; lastName: string; phoneNumber: string;}};
  mapOptions: {item: {id: string; firstName: string; lastName: string; phoneNumber: string;}};
  newContact: undefined;
  config: {
    item: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
};

// Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={ContactScreen} />
      <Stack.Screen
        name="newContact"
        options={{headerTitle: 'Create contact', headerBlurEffect: 'dark'}}
        component={CreateContact}
      />
      <Stack.Screen
        name="mapOptions"
        options={{headerTitle: 'Maps', headerBlurEffect: 'dark'}}
        component={MapsScreen}
      />
    </Stack.Navigator>
  );
};
// el tabNavigator se usa para poder tener un mini menu abajo de tu app, junto con el stack, que es donde estaran todas las vistas de tu aplicac
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={() => ({
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen
      name="HomeTab"
      component={StackNavigator}
      options={{
        headerShown: false,
        tabBarLabel: 'Home',
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="config"
      component={ContactPage}
      options={{
        headerShown: false,
        tabBarLabel: 'Profile',
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
      initialParams={{
        item: {firstName: 'John', lastName: 'Doe', phoneNumber: '123-456-7890'},
      }}
    />
  </Tab.Navigator>
  //options sirve para poder quitar el encabezado arriba en la app del name que pones
);

const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#aaaacc',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
