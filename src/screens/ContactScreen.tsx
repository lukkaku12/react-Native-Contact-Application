import { Text, StyleSheet, StatusBar, View, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type ContactDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

const ContactScreen = ({ route }: { route: DetailsScreenRouteProp }) => {
  const navigation = useNavigation<ContactDetailsNavigationProp>();
  const { item } = route.params;

  // Estado para almacenar los datos editables
  const [firstName, setFirstName] = useState(item.firstName);
  const [lastName, setLastName] = useState(item.lastName);
  const [phoneNumber, setPhoneNumber] = useState(item.phoneNumber);

  const handleUpdateContact = async () => {
    try {
      const result = await AsyncStorage.getItem('contacts');
      if (!result) {
        console.log('No contacts found');
        return;
      }

      const parsed = JSON.parse(result);
      const updatedContacts = parsed.map((contact: { phoneNumber: string }) => {
        if (contact.phoneNumber === item.phoneNumber) {
          return { ...contact, firstName, lastName, phoneNumber };
        }
        return contact;
      });

      await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
      console.log('Contact updated successfully');
      navigation.goBack(); // Regresar a la pantalla anterior después de guardar
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDeleteContact = async (phoneNumber: string) => {
    try {
      const result = await AsyncStorage.getItem('contacts');
      if (!result) {
        console.log('No contact found');
        return;
      }

      const parsed = JSON.parse(result);
      const updatedContacts = parsed.filter((contact: { phoneNumber: string }) => contact.phoneNumber !== phoneNumber);
      await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
      console.log('Contact deleted successfully');
      navigation.goBack();
    } catch (error) {
      throw new Error('Error parsing contact');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Edit Contact</Text>
      <View style={{ display: 'flex', width: '100%' }}>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
      </View>
      <Button title="Save Changes" onPress={handleUpdateContact} color="#4CAF50" />
      <FontAwesome5
        name='trash-alt'
        color={'red'}
        size={30}
        onPress={() => handleDeleteContact(item.phoneNumber)}
        style={{ alignSelf: 'flex-end', marginTop: 10 }}
      />
      <TouchableOpacity
      onPress={() => {navigation.navigate('mapOptions', {item})}}>
        <Text style={{ color: 'blue', fontWeight: 'bold' }}>go to maps</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    alignSelf: 'flex-start'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: 'white',
    color: 'black',
  },
});

export default ContactScreen;