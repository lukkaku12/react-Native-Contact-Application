import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../types/navigation.types';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

type ContactScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Config'
>;
const ContactPage = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string | number>('');
  const isFocused = useIsFocused();
  const navigation = useNavigation<ContactScreenNavigationProp>();
  const { setIsAuthenticated } = useAuth(); 

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
    };

    launchCamera(options as any, response => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setImageUri(uri);
          AsyncStorage.setItem('imageUser', uri);
        }
      }
    });
  };

  const getPhoto = async () => {
    try {
      const imageUser = await AsyncStorage.getItem('imageUser');
      if (imageUser) {
        setImageUri(imageUser);
      }
    } catch (e) {
      console.error('Error reading data from AsyncStorage', e);
    }
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options as any, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setImageUri(uri);
          AsyncStorage.setItem('imageUser', uri);
        }
      }
    });
  };

  useEffect(() => {
    const funcionPrueba = async () => {
      await getPhoto();
    };
    if (isFocused) {
      funcionPrueba();
    }
  }, [isFocused]);

  useEffect(() => {
    const getData = async () => {
      const email = await AsyncStorage.getItem('emailUser');
      const response = await axios.get(`https://react-native-backend-production.up.railway.app/users?email=${email}`);
      setName(response.data.name);
      setPhoneNumber(response.data.phoneNumber);
    };

    getData();
    getProfilePicture()
  }, [isFocused]);

  // Función para obtener la imagen de perfil
  const getProfilePicture = async () => {
    try {
      const userId = await AsyncStorage.getItem('idOfUser')
      const response = await axios.get(
        `https://react-native-backend-production.up.railway.app/profile-picture/${userId}`
      );
      setImageUri(response.data.profile_picture_uri); // Suponiendo que la respuesta contiene la URL de la imagen
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  // Función para subir la imagen de perfil
  const uploadProfilePicture = async ( imageUri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // Cambiar según el tipo de archivo
      name: 'profile_picture.jpg',
    });

    try {
      const userId = await AsyncStorage.getItem('idOfUser')
      const response = await axios.post(
        `https://react-native-backend-production.up.railway.app/profile-picture/upload/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Alert.alert('Success', 'Profile picture uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    }
  };


  // Función de logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      await AsyncStorage.removeItem('emailUser');
      await AsyncStorage.removeItem('token');
      Alert.alert('Logout', 'Has cerrado sesión correctamente');
      setIsAuthenticated(false);
      navigation.navigate('RegisterLogin')
    } catch (error) {
      console.log('Error al cerrar sesión', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Ionicons
              name="close"
              size={30}
              color="black"
              style={styles.closeIcon}
              onPress={() => {
                setModalVisible(false);
              }}
            />
            <View style={styles.modalView}>
              <Button title="Open Camera" onPress={openCamera} />
              <Button title="Open Gallery" onPress={openGallery} />
            </View>
          </View>
        </Modal>

        {/* Logo de Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={30} color="black" />
        </TouchableOpacity>

        <TouchableWithoutFeedback>
          {imageUri ? (
            <TouchableWithoutFeedback
              onPress={() => {
                setModalVisible(true);
              }}>
              <Image
                source={{ uri: imageUri }}
                style={{ width: 170, height: 170, borderRadius: 100 }}
              />
            </TouchableWithoutFeedback>
          ) : (
            <Ionicons
              name="person-circle"
              size={100}
              color="black"
              style={styles.icon}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.profileTitle}>Profile</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>Phone: {phoneNumber}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    alignSelf: 'center',
  },
  name: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    alignSelf: 'center',
  },
  phone: {
    fontSize: 16,
    color: 'black',
    alignSelf: 'center',
  },
  icon: {
    marginTop: 50,
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
});

export default ContactPage;