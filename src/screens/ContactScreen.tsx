import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type ContactDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Details'
>;

const ContactScreen = ({route}: {route: DetailsScreenRouteProp}) => {
  const navigation = useNavigation<ContactDetailsNavigationProp>();
  const {item} = route.params;

  const [firstName, setFirstName] = useState(item.name);
  const [lastName, setLastName] = useState(item.last_name);
  const [phoneNumber, setPhoneNumber] = useState(item.phone_number);

  const handleUpdateContact = async () => {
    // try {
    //   const result = await AsyncStorage.getItem('contacts');
    //   if (!result) {
    //     console.log('No contacts found');
    //     return;
    //   }

    //   const parsed = JSON.parse(result);
    //   const updatedContacts = parsed.map((contact: {phoneNumber: string}) => {
    //     if (contact.phoneNumber === item.phone_number) {
    //       return {...contact, firstName, lastName, phoneNumber};
    //     }
    //     return contact;
    //   });

    //   await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
    //   console.log('Contact updated successfully');
    //   navigation.goBack();
    // } catch (error) {
    //   console.error('Error updating contact:', error);
    // }


    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.patch(
        `https://react-native-backend-production.up.railway.app/contact/${item.id}`, 
        { name:firstName, last_name:lastName, phone_number:phoneNumber }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Contact updated successfully', response.data);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating contact:', error);
    }


  };

  const handleDeleteContact = async (id: number) => {
    // try {
    //   const result = await AsyncStorage.getItem('contacts');
    //   if (!result) {
    //     console.log('No contact found');
    //     return;
    //   }

    //   const parsed = JSON.parse(result);
    //   const updatedContacts = parsed.filter(
    //     (contact: {phoneNumber: string}) => contact.phoneNumber !== phoneNumber,
    //   );
    //   await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
    //   console.log('Contact deleted successfully');
    //   navigation.goBack();
    // } catch (error) {
    //   throw new Error('Error parsing contact');
    // }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete(`https://react-native-backend-production.up.railway.app/contact?id=${id}`, {headers:{Authorization:`Bearer ${token}`}});
      console.log('Contact deleted successfully', response.data);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }



  };

  const [inputStates, setInputStates] = useState({
    input1: false,
    input2: false,
    input3: false,
  });

  const handleFocus = (inputName: any) => {
    setInputStates(prevState => ({
      ...prevState,
      [inputName]: true,
    }));
  };

  const handleBlur = (inputName: any) => {
    setInputStates(prevState => ({
      ...prevState,
      [inputName]: false,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Text style={styles.header}>Edit Contact</Text>
      <View style={{display: 'flex', width: '100%'}}>
        <TextInput
          style={[styles.input, inputStates.input1 && styles.inputFocused]}
          value={firstName}
          onFocus={() => handleFocus('input1')}
          onBlur={() => handleBlur('input1')}
          onChangeText={setFirstName}
          placeholder="First Name"
        />
        <TextInput
          style={[styles.input, inputStates.input2 && styles.inputFocused]}
          value={lastName}
          onFocus={() => handleFocus('input2')}
          onBlur={() => handleBlur('input2')}
          onChangeText={setLastName}
          placeholder="Last Name"
        />
        <TextInput
          style={[styles.input, inputStates.input3 && styles.inputFocused]}
          value={phoneNumber}
          onFocus={() => handleFocus('input3')}
          onBlur={() => handleBlur('input3')}
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.buttonDiv}>
        <TouchableOpacity onPress={handleUpdateContact} style={styles.button}>
          <Text style={styles.buttonText}>Update Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteContact(item.id)}
          style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('MapOptions', {item})}
        style={[styles.image, { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 10, alignItems: 'center' }]}>
        <MaterialCommunityIcons name='map-marker-plus' size={60} color={'#4A90E2'}/>
        <Text style={styles.mapText}>Add/Edit Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white', // Asegúrate de que el fondo sea blanco
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
    marginLeft: 10,
    color: 'black',
    alignSelf: 'flex-start',
  },
  input: {
    height: 50,
    borderColor: 'rgb(184,183,191)',
    fontFamily: 'SF-Pro-Rounded-Regular',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 17,
    width: '100%',
    backgroundColor: 'rgb(247, 247, 250)',
    color: 'rgb(184,183,191)',
  },
  inputFocused: {
    borderColor: 'rgb(96,154,248)',
    backgroundColor: 'rgb(231,242,253)',
    color: 'rgb(96,154,248)',
  },
  buttonDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'rgb(96,154,248)',
    borderRadius: 10,
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Bold',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    marginTop: 100,
  },
  mapText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default ContactScreen;