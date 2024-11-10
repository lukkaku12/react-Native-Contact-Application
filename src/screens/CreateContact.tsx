import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { RootStackParamList } from '../../App';

type CreateContactScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'newContact'
>;

const storeData = async (newContact: {
  name: string;
  last_name: string;
  phone_number: string;
  picture_uri: string;
}) => {
  try {
    const response = await axios.post('http://192.168.1.5:3000/contact', newContact);
    console.log('Contact saved successfully', response.data);
  } catch (e) {
    console.error('Error saving data:', e);
  }
};

const CreateContact = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation<CreateContactScreenNavigationProp>();

  const handleSaveContact = async () => {
    const newContact = {
      name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      picture_uri: 'asda', // O puedes dejarlo vacío si no es obligatorio
    };
    console.log(newContact, firstName, 'hooooasdsa');
    

    await storeData(newContact);

    Alert.alert(
      'Contacto guardado',
      `Nombre: ${firstName} ${lastName}, Teléfono: ${phoneNumber}`,
    );

    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Contacto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="gray"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="gray"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Button title="Guardar Contacto" onPress={handleSaveContact} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    color: 'black',
  },
});

export default CreateContact;