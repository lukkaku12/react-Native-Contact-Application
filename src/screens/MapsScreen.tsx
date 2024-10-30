import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { OPENWEATHER_API_KEY } from '@env';
import DetailPopup from '../components/DetailPopup';

type MapsScreenProp = RouteProp<RootStackParamList, 'Details'>;

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

  const handleMapPress = (e: any) => {
    const newMarker = e.nativeEvent.coordinate;
    setMarker(newMarker);
    AsyncStorage.setItem(
      `user-${item.firstName + item.lastName}`,
      JSON.stringify(newMarker),
    );
  };

  const handleRoutePress = () => {
    console.log('Ruta hacia', marker);
  };

  useEffect(() => {
    const loadMarkerFromStorage = async () => {
      const storedMarker = await AsyncStorage.getItem(
        `user-${item.firstName + item.lastName}`,
      );
      if (storedMarker) {
        setMarker(JSON.parse(storedMarker));
      }
    };

    loadMarkerFromStorage();
  }, [item.firstName, item.lastName]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (marker) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${marker.latitude}&lon=${marker.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
          setWeatherData(response.data);
          console.log(response.data);
        } catch (err) {
          console.error('Error fetching weather data:', err);
        }
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