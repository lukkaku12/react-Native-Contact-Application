import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type CreateContactScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'newContact'>;

const storeData = async (newContact: {
  id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => {
    try {
      const existingContacts = await AsyncStorage.getItem('contacts');
      const contactsArray = existingContacts ? JSON.parse(existingContacts) : [];
      
      // Añadir el nuevo contacto al array existente
      const updatedContacts = [...contactsArray, newContact];
      const jsonValue = JSON.stringify(updatedContacts);
      
      await AsyncStorage.setItem('contacts', jsonValue);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  };
  
  const CreateContact = () => {
    // Estados para almacenar el valor de cada campo del formulario
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigation = useNavigation<CreateContactScreenNavigationProp>();
    const id = Date.now().toString(); // Generar un ID único para cada contacto
  
    const handleSaveContact = async () => {
      const newContact = { id, firstName, lastName, phoneNumber };
  
      // Guardar el nuevo contacto
      await storeData(newContact);
  
      Alert.alert(
        'Contacto guardado',
        `Nombre: ${firstName} ${lastName}, Teléfono: ${phoneNumber}`,
      );
  
      // Limpiar los campos después de guardar
      setFirstName('');
      setLastName('');
      setPhoneNumber('');

      navigation.navigate("Home");
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Contacto</Text>

      {/* Campo para el nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="gray" 
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Campo para el apellido */}
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="gray" 
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Campo para el número de teléfono */}
      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        placeholderTextColor="gray" 
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Botón para guardar el contacto */}
      <Button title="Save Contact" onPress={handleSaveContact} />
    </View>
  );
};

// Estilos del componente
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
