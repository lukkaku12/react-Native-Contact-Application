import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const DetailPopup = ({ weatherData, onRoutePress }:{ weatherData: any, onRoutePress: any }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, feels_like, pressure, humidity },
    weather,
    wind: { speed },
  } = weatherData;

  const weatherIconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <View style={styles.popupContainer}>
      <Text style={styles.popupLocation}>{name}</Text>
      <View style={styles.weatherRow}>
        <Image source={{ uri: weatherIconUrl }} style={styles.weatherIcon} />
        <Text style={styles.weatherDescription}>{weather[0].description}</Text>
      </View>
      <Text style={styles.popupTemperature}>Temperatura: {temp}°C</Text>
      <Text>Sensación Térmica: {feels_like}°C</Text>
      <Text>Humedad: {humidity}%</Text>
      <Text>Presión: {pressure} hPa</Text>
      <Text>Viento: {speed} m/s</Text>

      {/* <View style={styles.popupActions}>
        <TouchableOpacity style={styles.popupButton} onPress={onRoutePress}>
          <Text style={styles.popupButtonText}>Ver Rutas</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
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
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherDescription: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  popupTemperature: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
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

export default DetailPopup;