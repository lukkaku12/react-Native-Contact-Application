import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {RootStackParamList} from '../types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RegisterLoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RegisterLogin'>;


const LoginForm = ({ navigation }: { navigation: RegisterLoginScreenNavigationProp }) => {

  // const navigation = useNavigation<RegisterLoginScreenNavigationProp>()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputStates, setInputStates] = useState({
    email: false,
    password: false,
  });

  const handleFocus = (inputName: keyof typeof inputStates) => {
    setInputStates(prev => ({
      ...prev,
      [inputName]: true,
    }));
  };

  const handleBlur = (inputName: keyof typeof inputStates) => {
    setInputStates(prev => ({
      ...prev,
      [inputName]: false,
    }));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    try {
      const response = await axios.post(
        'https://react-native-backend-production.up.railway.app/auth/login',
        {
          email,
          password,
        },
      );

      if (response.data.status == 200) {
        Alert.alert('Login exitoso', 'Bienvenido de nuevo');
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('emailUser', email);
        await AsyncStorage.setItem('token', response.data.message);
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={[styles.input, inputStates.email && styles.inputFocused]}
        placeholder="Correo electrónico"
        placeholderTextColor={'gray'}
        value={email}
        onFocus={() => handleFocus('email')}
        onBlur={() => handleBlur('email')}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={[styles.input, inputStates.password && styles.inputFocused]}
        placeholder="Contraseña"
        placeholderTextColor={'gray'}
        value={password}
        onFocus={() => handleFocus('password')}
        onBlur={() => handleBlur('password')}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgb(184,183,191)', // Color inicial
    fontFamily: 'SF-Pro-Rounded-Regular',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 17,
    width: 300,
    height: 50,
    marginBottom: 10,
    backgroundColor: 'rgb(247, 247, 250)', // Fondo inicial
    color: 'black',
  },
  inputFocused: {
    borderColor: 'rgb(96,154,248)', // Color de borde cuando está activo
    backgroundColor: 'rgb(231,242,253)', // Fondo activo
    color: 'rgb(96,154,248)', // Color del texto activo
  },
  button: {
    backgroundColor: 'rgb(96,154,248)',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: 200,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Bold',
    color: 'white',
  },
});
