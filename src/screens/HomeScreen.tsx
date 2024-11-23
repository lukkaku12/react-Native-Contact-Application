import React, { useEffect, useState } from "react";
import {StackNavigationProp} from '@react-navigation/stack';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from '../types/navigation.types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

const getData = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); // Reemplaza con tu token real
    const email = await AsyncStorage.getItem('emailUser');
    // AsyncStorage.clear()

    const responseEmail = await axios.get(`https://react-native-backend-production.up.railway.app/users?email=${email}`);
    

    if (!token) {
      throw new Error('error with getting token')
    }
    
    const response = await axios.get(`https://react-native-backend-production.up.railway.app/contact?user=${responseEmail.data.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,

      },
    });
    AsyncStorage.setItem('idOfUser', String(responseEmail.data.id));
    const contactsFromAPI = response.data; 
    
    
    // const value = await AsyncStorage.getItem('contacts');
    // console.log(value);
    // return value ? JSON.parse(value) : [];
    
    return response ? contactsFromAPI : [] ;
  } catch (e) {
    console.error('Error reading data from database contact', e);
    return [];
  }
};

const sortContactsByLetter = (contacts: any) => {
    return contacts.reduce((groups: any, contact: any) => {
        const firstLetter = contact.name[0].toUpperCase();
        const foundGroup = groups.find((group: any) => group.letter === firstLetter)

        if (foundGroup) {
            foundGroup.data.push(contact);
        } else {
            groups.push({ letter: firstLetter, data: [contact] });
        }
        return groups;
    }, [])
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const isFocused = useIsFocused();

  const fetchContacts = async () => {
    const storedContacts = await getData();

    const contactsSorted = storedContacts.sort((a: any, b: any) => a.name.localeCompare(b.name));
    const groupedContacts = sortContactsByLetter(contactsSorted);
    setContacts(groupedContacts);
  };

  useEffect(() => {
    fetchContacts();
    // setContacts(contactsSorted);
    if (isFocused) fetchContacts();
  }, [isFocused]);

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Contactos</Text>
        <TouchableOpacity style={styles.addIcon} onPress={() => navigation.navigate('NewContact')}>
          <AntDesign name="form" color={'#555'} size={24} />
        </TouchableOpacity>
      </View>
      {contacts.length === 0 ? (
        <Text style={styles.noContactsText}>No hay contactos disponibles.</Text>
      ) : (
        // <FlatList
        //   data={contacts}
        //   renderItem={({ item }) => (
        //     <View style={styles.item}>
        //       <Text
        //         style={styles.title}
        //         onPress={() => navigation.navigate("Details", { item })}
        //       >
        //         {item.firstName} {item.lastName}
        //       </Text>
        //     </View>
        //   )}
        //   keyExtractor={(item) => item.id}
        // />


        <SectionList
  sections={contacts}  // Array de secciones
  keyExtractor={(item) => item.name + item.last_name} 
  renderItem={({ item }) => (
    <View style={styles.item}>
           <Text
             style={styles.title}
             onPress={() => navigation.navigate("Details", { item })}
           >
             {item.name} {item.last_name}
           </Text>
         </View>
  )}
  renderSectionHeader={({ section }) => (
    <Text style={styles.header}>{section.letter}</Text>
  )}
/>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 20,
    backgroundColor: "#f4f4f8",
  },
  itemText: {
    fontSize: 16,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  addIcon: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 20,
  },
  noContactsText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});

export default HomeScreen;