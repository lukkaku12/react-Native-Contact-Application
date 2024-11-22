import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const RegisterForm = () => {
  // Estados para cada campo del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [inputStates, setInputStates] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
  });

  // Manejo del foco de los campos
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

  // Función para enviar los datos al backend
  const handleSubmit = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
    try {
      const response = await axios.post('http://192.168.89.189:3000/users', {
        name,
        email,
        password,
        phoneNumber: phone,
      });
      if (response.status === 201) {
        Alert.alert(
          'Registro exitoso',
          'El usuario ha sido registrado correctamente',
        );
        // Limpia los campos del formulario
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al registrarte');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={[styles.input, inputStates.name && styles.inputFocused]}
        placeholder="Nombre"
        placeholderTextColor={'gray'}
        value={name}
        onFocus={() => handleFocus('name')}
        onBlur={() => handleBlur('name')}
        onChangeText={setName}
      />

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

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={[styles.input, inputStates.phone && styles.inputFocused]}
        placeholder="Teléfono"
        placeholderTextColor={'gray'}
        value={phone}
        onFocus={() => handleFocus('phone')}
        onBlur={() => handleBlur('phone')}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterForm;

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
    width: 200,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Bold',
    color: 'white',
  },
});
