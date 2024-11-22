import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import AntDesign from 'react-native-vector-icons/AntDesign';

const onboardingStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Poppins-SemiBold',
  },
});

const OnBoarding = ({onComplete}: {onComplete: () => void}) => {
  return (
    <Onboarding
      onDone={onComplete}
      onSkip={onComplete}
      pages={[
        {
          backgroundColor: '#fff',
          image: <AntDesign name="contacts" size={100} color="#333" />,
          title: <Text style={onboardingStyles.title}>Crea Contactos</Text>,
          subtitle: (
            <Text style={onboardingStyles.subtitle}>
              Guarda y organiza a tus contactos fácilmente.
            </Text>
          ),
        },
        {
          backgroundColor: '#4A90E2',
          image: <AntDesign name="edit" size={100} color="#fff" />,
          title: <Text style={onboardingStyles.title}>Edita y Actualiza</Text>,
          subtitle: (
            <Text style={onboardingStyles.subtitle}>
              Actualiza detalles de contactos cuando lo necesites.
            </Text>
          ),
        },
        {
          backgroundColor: '#8DC9FF',
          image: <AntDesign name="enviromento" size={100} color="#fff" />,
          title: <Text style={onboardingStyles.title}>Ubicación y Clima</Text>,
          subtitle: (
            <Text style={onboardingStyles.subtitle}>
              Agrega ubicación y consulta el clima actual.
            </Text>
          ),
        },
      ]}
    />
  );
};

export default OnBoarding;
