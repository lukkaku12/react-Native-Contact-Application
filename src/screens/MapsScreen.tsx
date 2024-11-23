import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { OPENWEATHER_API_KEY } from '@env';
import DetailPopup from '../components/DetailPopup';
import { RootStackParamList } from '../types/navigation.types';

type MapsScreenProp = RouteProp<RootStackParamList, 'MapOptions'>;

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
}


const MapsScreen = ({ route }: { route: MapsScreenProp }) => {
  const { item } = route.params;
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleMapPress = async (e: any) => {
    const newMarker = e.nativeEvent.coordinate;
    setMarker(newMarker);
    
    if (newMarker && item && item.id) {
      try {
        // Intentamos obtener las coordenadas existentes
        const [responseLatitude, responseLongitude] = await Promise.allSettled([
          axios.get(`http://192.168.1.5:3000/latitude/${item.id}`),
          axios.get(`http://192.168.1.5:3000/longitude/${item.id}`)
        ]);
  
        const existingLatitude = responseLatitude.status === 'fulfilled' ? responseLatitude.value.data.latitude : null;
        const existingLongitude = responseLongitude.status === 'fulfilled' ? responseLongitude.value.data.longitude : null;
  
        // Si las coordenadas no existen, las creamos
        if (!existingLatitude || !existingLongitude) {
          await Promise.all([
            axios.post(`http://192.168.1.5:3000/latitude/`, {
              latitude: newMarker.latitude,
              contact_id: item.id
            }),
            axios.post(`http://192.168.1.5:3000/longitude/`, {
              longitude: newMarker.longitude,
              contact_id: item.id
            })
          ]);
          console.log('Coordenadas creadas con éxito');
        } 
        // Si existen pero son diferentes, las actualizamos
        else if (existingLatitude !== newMarker.latitude || existingLongitude !== newMarker.longitude) {
          await Promise.all([
            axios.put(`http://192.168.1.5:3000/latitude?id=${item.id}`, {
              latitude: newMarker.latitude
            }),
            axios.put(`http://192.168.1.5:3000/longitude?id=${item.id}`, {
              longitude: newMarker.longitude
            })
          ]);
          console.log('Coordenadas actualizadas con éxito');
        }
      } catch (err) {
        console.error('Error al verificar o actualizar las coordenadas:', err);
      }
    }
  };
  
  const handleRoutePress = () => {
    console.log('Ruta hacia', marker);
  };

  useEffect(() => {
    const loadMarkerFromDb = async () => {
      try {
        // Ejecutamos ambas peticiones en paralelo para reducir el tiempo de espera
        const [storedLatitude, storedLongitude] = await Promise.all([
          axios.get(`http://192.168.89.189:3000/latitude/contact/${item.id}`),
          axios.get(`http://192.168.89.189:3000/longitude/contact/${item.id}`)
        ]);
  
        // Verifica si ambas coordenadas existen y son válidas antes de setear el marcador
        if (storedLatitude.data?.latitude && storedLongitude.data?.longitude) {
          setMarker({
            latitude: parseFloat(storedLatitude.data.latitude),
            longitude: parseFloat(storedLongitude.data.longitude),
          });
          console.log('Marker set:', storedLatitude.data.latitude, storedLongitude.data.longitude);
        } else {
          // Si no se encuentran coordenadas, el marcador queda como null
          setMarker(null);
          console.warn('No coordinates found in the database');
        }
      } catch (error) {
        console.log('Error fetching coordinates:', (error as any).message);
        // En caso de error, también dejamos el marcador como null y continuamos
        setMarker(null);
      }
    };
  
    if (item?.id) {
      loadMarkerFromDb();
    }
  }, [item?.id]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (marker) {
        try {
          
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${marker.latitude}&lon=${marker.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
          console.log(OPENWEATHER_API_KEY)
          
          setWeatherData(response.data);
        } catch (err) {
          console.error('Error fetching weather data:', (err as any).response ? (err as any).response.data : (err as any).message);
        }
      } else {
        console.log('Marker is null, skipping fetch');
      }
    };
  
    fetchWeatherData();
  }, [marker]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 6.264339339074952,
          longitude: -75.57382127437613,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {marker && (
          <Marker
            draggable
            coordinate={marker}
            title="User's Location"
            description={weatherData ? `Temp: ${weatherData.main.temp}°C` : 'Loading...'}
          />
        )}
      </MapView>

      {weatherData && (
        <DetailPopup
          weatherData={weatherData}
          onRoutePress={handleRoutePress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  popupContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
  },
  popupLocation: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  popupCoordinates: {
    color: '#bbb',
    fontSize: 14,
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  popupButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#1E90FF',
  },
  popupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MapsScreen;