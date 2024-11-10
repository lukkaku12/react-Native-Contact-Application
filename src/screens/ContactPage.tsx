import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  Button,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../App';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ContactPageRouteProp = RouteProp<RootStackParamList, 'config'>; 

type ContactPageProps = {
  route: ContactPageRouteProp;
};

const ContactPage: React.FC<ContactPageProps> = ({route}) => {
  const {item} = route.params;

  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  
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
        <TouchableWithoutFeedback>
          {imageUri ? (
            <TouchableWithoutFeedback
              onPress={() => {
                setModalVisible(true);
              }}>
              <Image
                source={{uri: imageUri}}
                style={{width: 170, height: 170, borderRadius: 100}}
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
        <TextInput style={styles.name}>
          {item.name} {item.last_name}
        </TextInput>
        <TextInput style={styles.phone}>Phone: {item.phone_number}</TextInput>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Profile section styles
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

  // Icon styles
  icon: {
    marginTop: 50,
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },

  // Modal styles
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
});

export default ContactPage;
